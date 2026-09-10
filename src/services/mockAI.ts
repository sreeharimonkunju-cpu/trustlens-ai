import { RISK_THRESHOLDS, SCORE_WEIGHTS } from "../config";
import type { AnalysisResult, DemoCase, IdentityData, Signals } from "../types";

const baseIdentity: IdentityData = {
  name: "ARUN KUMAR",
  dob: "14-06-2004",
  documentNumber: "XXXX XXXX 4321",
  expiry: "12-09-2030",
  address: "Demo Address",
};
const cases: Record<DemoCase, { signals: Signals; manipulation: number; indicators: string[]; risks: AnalysisResult["risks"]; identity: IdentityData }> = {
  genuine: {
    signals: { document: 92, face: 96, identity: 100, quality: 90, ocr: 95 },
    manipulation: 8,
    indicators: [],
    risks: [],
    identity: baseIdentity,
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
    manipulation: 8,
    indicators: [],
    risks: [],
    identity: baseIdentity,
  },
};

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

export async function analyzeDocument(file?: File, demoCase: DemoCase = "genuine"): Promise<AnalysisResult> {
  await new Promise((r) => setTimeout(r, 650));
  const data = cases[demoCase];
  const score = calculateTrustScore(data.signals);
  return {
    id: `TL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
    score,
    risk: getRisk(score),
    signals: data.signals,
    identity: data.identity,
    forensics: {
      manipulation: data.manipulation,
      level: data.manipulation >= 65 ? "High" : data.manipulation >= 30 ? "Medium" : "Low",
      indicators: data.indicators,
    },
    face: {
      available: data.signals.face !== null,
      similarity: data.signals.face,
      match: data.signals.face === null ? null : data.signals.face >= 70,
    },
    consistency: [
      { label: "Name", status: "match" },
      { label: "Date of Birth", status: demoCase === "mismatch" || demoCase === "altered" ? "warning" : "match", detail: demoCase === "mismatch" ? "Expected 12-05-2003 · Detected 14-06-2004" : demoCase === "altered" ? "Expected 14-06-2004 · Detected 12-05-2005" : undefined },
      { label: "Document Number", status: "match", detail: "Valid demo format" },
      { label: "Address", status: "match" },
      { label: "Photo", status: "match", detail: "Face detected" },
    ],
    positives: [
      "Document structure detected",
      "OCR fields successfully extracted",
      ...(data.signals.face !== null ? ["Face detected"] : []),
      ...(demoCase === "genuine" || demoCase === "no-selfie" ? ["Identity fields consistent", "Document quality acceptable"] : []),
    ],
    risks: data.risks,
    demo: true,
    demoCase,
    createdAt: new Date().toISOString(),
    documentName: file?.name ?? `Demo ${demoCase} identity document`,
    documentType: demoCase === "no-selfie" ? "ID Card" : "Demo Identity Document",
  };
}