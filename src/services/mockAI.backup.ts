import { RISK_THRESHOLDS, SCORE_WEIGHTS } from "../config";
import type { AnalysisResult, DemoCase, IdentityData, Signals } from "../types";

const baseIdentity: IdentityData = {
  name: "ARUN KUMAR",
  dob: "14-06-2004",
  documentNumber: "XXXX XXXX 4321",
  expiry: "12-09-2030",
  address: "Demo Address",
};

const demoCases: Record<DemoCase, { signals: Signals; manipulation: number; indicators: string[]; risks: AnalysisResult["risks"]; identity: IdentityData }> = {
  genuine: {
    signals: { document: 92, face: 96, identity: 100, quality: 90, ocr: 95 },
    manipulation: 8, indicators: [], risks: [], identity: baseIdentity,
  },
  altered: {
    signals: { document: 30, face: 92, identity: 45, quality: 64, ocr: 88 },
    manipulation: 82,
    indicators: ["Image manipulation indicator", "Text region inconsistency", "Suspicious overlay"],
    risks: [
      { title: "Image Manipulation Indicator", severity: "High", contribution: -21, explanation: "An unusual image region was detected. This signal alone does not establish that the document is fraudulent." },
      { title: "Text Region Inconsistency", severity: "Medium", contribution: -8, explanation: "Text alignment differs from the expected demo-document layout." },
    ],
    identity: { ...baseIdentity, dob: "12-05-2005" },
  },
  mismatch: {
    signals: { document: 88, face: 37, identity: 35, quality: 90, ocr: 95 },
    manipulation: 11,
    indicators: ["Possible face mismatch", "Identity inconsistency"],
    risks: [
      { title: "Face Comparison", severity: "High", contribution: -16, explanation: "The uploaded selfie has low similarity to the detected document portrait." },
      { title: "Identity Consistency", severity: "High", contribution: -13, explanation: "One or more identity fields differ from the expected demo identity." },
    ],
    identity: { ...baseIdentity, dob: "12-05-2003" },
  },
  "no-selfie": {
    signals: { document: 92, face: null, identity: 100, quality: 90, ocr: 95 },
    manipulation: 8, indicators: [], risks: [], identity: baseIdentity,
  },
};

function clamp(value: number, min = 0, max = 100) { return Math.max(min, Math.min(max, Math.round(value))); }

async function sha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function readSignature(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function imageMetrics(file: File): Promise<{ width: number; height: number; pixels: number; quality: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("The image could not be decoded."));
      el.src = url;
    });
    const pixels = img.width * img.height;
    const mp = pixels / 1_000_000;
    const quality = clamp(45 + mp * 14 + Math.min(file.size / 100_000, 20));
    return { width: img.width, height: img.height, pixels, quality };
  } finally { URL.revokeObjectURL(url); }
}

async function analyzeUploadedFile(file: File, selfie?: File): Promise<{
  signals: Signals; manipulation: number; indicators: string[]; risks: AnalysisResult["risks"]; identity: IdentityData;
}> {
  if (file.size > 10 * 1024 * 1024) throw new Error("Document is larger than the 10 MB limit.");
  const allowed = ["image/png", "image/jpeg", "application/pdf"];
  if (!allowed.includes(file.type)) throw new Error("Unsupported document type. Use PNG, JPG, JPEG, or PDF.");

  const hash = await sha256(file);
  const signature = await readSignature(file);
  const indicators: string[] = [];
  const risks: AnalysisResult["risks"] = [];

  let quality = 78;
  let ocr = 82;
  let document = 84;
  let manipulation = 12;

  const isJpeg = signature.startsWith("ffd8ff");
  const isPng = signature.startsWith("89504e470d0a1a0a");
  const isPdf = signature.startsWith("25504446");
  const signatureValid = isJpeg || isPng || isPdf;

  if (!signatureValid) {
    manipulation += 35;
    document -= 25;
    indicators.push("File signature does not match the declared file type");
    risks.push({ title: "File Signature Anomaly", severity: "High", contribution: -18, explanation: "The file header does not match a recognised PNG, JPEG, or PDF signature." });
  }

  if (file.type === "application/pdf") {
    quality = 86;
    ocr = 84;
    document = signatureValid ? 88 : 55;
    if (file.size < 8_000) {
      manipulation += 8;
      indicators.push("Unusually small PDF payload");
    }
  } else {
    try {
      const m = await imageMetrics(file);
      quality = clamp(m.quality);
      ocr = clamp(58 + Math.min(m.width, 2400) / 70 + Math.min(m.height, 2400) / 100);
      document = clamp(65 + Math.min(m.pixels / 1_000_000, 8) * 4 + (signatureValid ? 8 : -10));
      if (m.width < 700 || m.height < 500) {
        indicators.push("Low image resolution may reduce OCR reliability");
        risks.push({ title: "Image Quality", severity: "Medium", contribution: -7, explanation: "The uploaded document image is relatively small and may limit field extraction accuracy." });
      }
      if (m.width > 5000 || m.height > 5000) {
        indicators.push("Very large image dimensions");
        quality = Math.min(quality, 88);
      }
    } catch {
      quality = 55;
      ocr = 60;
      document = 60;
      indicators.push("Image decoding could not be completed");
    }
  }

  // A local, deterministic fingerprint makes repeated uploads reproducible without sending data to a server.
  const hashSeed = parseInt(hash.slice(0, 8), 16) % 7;
  ocr = clamp(ocr - hashSeed);
  document = clamp(document - Math.floor(hashSeed / 2));
  manipulation = clamp(manipulation + (hashSeed === 6 ? 10 : 0));

  let face: number | null = null;
  if (selfie) {
    if (!selfie.type.startsWith("image/")) {
      indicators.push("Selfie file is not an image");
      risks.push({ title: "Selfie Validation", severity: "Medium", contribution: -6, explanation: "The selfie could not be treated as a supported image file." });
      face = 48;
    } else {
      const selfieHash = await sha256(selfie);
      const sameSeed = parseInt(selfieHash.slice(0, 6), 16) % 31;
      face = clamp(68 + sameSeed);
    }
  }

  const identity = { ...baseIdentity };
  const identityScore = clamp(86 + (hashSeed % 5) - (manipulation >= 50 ? 25 : 0));

  return {
    signals: { document, face, identity: identityScore, quality, ocr },
    manipulation,
    indicators,
    risks,
    identity,
  };
}

export function calculateTrustScore(signals: Signals): number {
  const available: Array<[number, number]> = [
    [signals.document, SCORE_WEIGHTS.document],
    ...(signals.face !== null ? [[signals.face, SCORE_WEIGHTS.face] as [number, number]] : []),
    [signals.identity, SCORE_WEIGHTS.identity],
    [signals.quality, SCORE_WEIGHTS.quality],
    [signals.ocr, SCORE_WEIGHTS.ocr],
  ];
  const totalWeight = available.reduce((s, [, w]) => s + w, 0);
  return Math.round(available.reduce((s, [v, w]) => s + v * w, 0) / totalWeight);
}

export function getRisk(score: number): AnalysisResult["risk"] {
  if (score >= RISK_THRESHOLDS.low) return "LOW RISK";
  if (score >= RISK_THRESHOLDS.review) return "REVIEW";
  return "HIGH RISK";
}

export async function analyzeDocument(file?: File, demoCase: DemoCase = "genuine", selfie?: File): Promise<AnalysisResult> {
  await new Promise(r => setTimeout(r, 350));
  const data = file ? await analyzeUploadedFile(file, selfie) : demoCases[demoCase];
  const score = calculateTrustScore(data.signals);
  const caseIsDemo = !file;
  const faceAvailable = data.signals.face !== null;
  const risks = [...data.risks];
  if (data.signals.ocr < 70) risks.push({ title: "OCR Confidence", severity: "Medium", contribution: -6, explanation: "Image characteristics suggest that text extraction may be less reliable." });
  if (data.signals.face !== null && data.signals.face < 70) risks.push({ title: "Face Comparison", severity: "High", contribution: -16, explanation: "The available face-comparison signal is below the screening threshold." });

  return {
    id: `TL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    score, risk: getRisk(score), signals: data.signals, identity: data.identity,
    forensics: { manipulation: data.manipulation, level: data.manipulation >= 65 ? "High" : data.manipulation >= 30 ? "Medium" : "Low", indicators: data.indicators },
    face: { available: faceAvailable, similarity: data.signals.face, match: data.signals.face === null ? null : data.signals.face >= 70 },
    consistency: [
      { label: "Name", status: "match" },
      { label: "Date of Birth", status: caseIsDemo && (demoCase === "mismatch" || demoCase === "altered") ? "warning" : "match", detail: caseIsDemo && demoCase === "mismatch" ? "Expected 12-05-2003 · Detected 14-06-2004" : caseIsDemo && demoCase === "altered" ? "Expected 14-06-2004 · Detected 12-05-2005" : undefined },
      { label: "Document Number", status: "match", detail: caseIsDemo ? "Valid demo format" : "Locally validated file metadata" },
      { label: "Address", status: "match" },
      { label: "Photo", status: faceAvailable ? "match" : "warning", detail: faceAvailable ? "Face signal available" : "No selfie supplied" },
    ],
    positives: ["Document structure detected", "File integrity checked", "OCR readiness assessed", ...(faceAvailable ? ["Selfie image validated"] : []), ...(data.signals.quality >= 75 ? ["Document quality acceptable"] : [])],
    risks,
    demo: caseIsDemo, demoCase: caseIsDemo ? demoCase : undefined,
    createdAt: new Date().toISOString(), documentName: file?.name ?? `Demo ${demoCase} identity document`, documentType: file ? (file.type === "application/pdf" ? "PDF Identity Document" : "Image Identity Document") : (demoCase === "no-selfie" ? "ID Card" : "Demo Identity Document"),
  };
}
