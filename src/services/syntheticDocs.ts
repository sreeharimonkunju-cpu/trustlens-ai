import type { DemoCase } from "../types";

/**
 * Dynamically generates realistic synthetic identity document images for hackathon demonstrations.
 * When a user selects a demo case, a real File is produced on canvas with actual readable text,
 * security patterns, guilloche borders, MRZ lines, or simulated alterations.
 */
export async function generateSyntheticDocumentFile(caseType: DemoCase): Promise<{
  docFile: File;
  selfieFile?: File;
}> {
  const width = 860;
  const height = 540; // Standard ID-1 card aspect ratio ~1.586
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create synthetic doc canvas");

  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (caseType === "altered") {
    bgGrad.addColorStop(0, "#19283c");
    bgGrad.addColorStop(0.5, "#152030");
    bgGrad.addColorStop(1, "#0f1722");
  } else if (caseType === "mismatch") {
    bgGrad.addColorStop(0, "#1f2a3d");
    bgGrad.addColorStop(1, "#111824");
  } else {
    bgGrad.addColorStop(0, "#1c2b42");
    bgGrad.addColorStop(0.6, "#142135");
    bgGrad.addColorStop(1, "#0d1626");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Guilloche & security background lines
  ctx.strokeStyle = "rgba(78, 172, 219, 0.08)";
  ctx.lineWidth = 1;
  for (let i = -100; i < width + 100; i += 18) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.bezierCurveTo(i + 80, height * 0.3, i - 60, height * 0.7, i + 40, height);
    ctx.stroke();
  }

  // Header banner
  ctx.fillStyle = "rgba(32, 70, 105, 0.6)";
  ctx.fillRect(20, 20, width - 40, 56);
  ctx.strokeStyle = "rgba(98, 214, 255, 0.3)";
  ctx.strokeRect(20, 20, width - 40, 56);

  ctx.fillStyle = "#62d6ff";
  ctx.font = "bold 13px 'Space Grotesk', Inter, sans-serif";
  ctx.fillText("INTERNATIONAL REPUBLIC DEMO IDENTITY CARD", 42, 45);
  ctx.fillStyle = "#9eb2cb";
  ctx.font = "10px Inter, sans-serif";
  ctx.fillText("GOVERNMENT STANDARD IDENTITY DOCUMENT · SIMULATION SPECIMEN", 42, 63);

  // Microprint line
  ctx.fillStyle = "rgba(98, 214, 255, 0.25)";
  ctx.font = "6px monospace";
  ctx.fillText("TRUSTLENS VERIFIED SPECIMEN · SECURE CHIP · AUTHENTICITY LAYER · ".repeat(6), 25, 88);

  // Photo Box
  const photoX = 45;
  const photoY = 110;
  const photoW = 200;
  const photoH = 260;

  ctx.fillStyle = "#0c1726";
  ctx.fillRect(photoX, photoY, photoW, photoH);
  ctx.strokeStyle = caseType === "altered" ? "rgba(255, 120, 135, 0.7)" : "#2e5178";
  ctx.lineWidth = 2;
  ctx.strokeRect(photoX, photoY, photoW, photoH);

  // Draw portrait avatar
  const portraitGrad = ctx.createLinearGradient(photoX, photoY, photoX + photoW, photoY + photoH);
  portraitGrad.addColorStop(0, "#294668");
  portraitGrad.addColorStop(1, "#122035");
  ctx.fillStyle = portraitGrad;
  ctx.fillRect(photoX + 2, photoY + 2, photoW - 4, photoH - 4);

  // Stylized head & shoulders
  ctx.fillStyle = "#5d7c9f";
  // Head
  ctx.beginPath();
  ctx.arc(photoX + photoW / 2, photoY + 95, 48, 0, Math.PI * 2);
  ctx.fill();
  // Shoulders
  ctx.beginPath();
  ctx.ellipse(photoX + photoW / 2, photoY + 235, 80, 60, 0, 0, Math.PI, true);
  ctx.fill();

  // Face watermark seal
  ctx.strokeStyle = "rgba(98, 214, 255, 0.35)";
  ctx.beginPath();
  ctx.arc(photoX + photoW - 25, photoY + photoH - 25, 30, 0, Math.PI * 2);
  ctx.stroke();

  // If altered demo case, paint visible compression/splicing artifact over the name/DOB
  if (caseType === "altered") {
    ctx.fillStyle = "rgba(255, 230, 150, 0.08)";
    ctx.fillRect(280, 175, 450, 65);
    ctx.strokeStyle = "rgba(255, 150, 150, 0.4)";
    ctx.strokeRect(280, 175, 450, 65);
  }

  // Text details (Clear and crisp for Tesseract OCR recognition)
  ctx.fillStyle = "#8da2bc";
  ctx.font = "bold 10px Inter, sans-serif";

  const drawField = (label: string, value: string, x: number, y: number, isAnomaly = false) => {
    ctx.fillStyle = "#7b91ad";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillText(label, x, y);

    ctx.fillStyle = isAnomaly ? "#ffd478" : "#f1f5fa";
    ctx.font = isAnomaly ? "bold 16px 'Space Grotesk', Inter, monospace" : "bold 15px 'Space Grotesk', Inter, sans-serif";
    ctx.fillText(value, x, y + 19);
  };

  const nameVal = caseType === "altered" ? "ARUN KUMAR" : caseType === "mismatch" ? "ROHIT SHARMA" : "ARUN KUMAR";
  const dobVal = caseType === "altered" ? "12/05/2005" : "14/06/2004";
  const docNumVal = caseType === "altered" ? "ID-8921-4321-X" : "TL-2026-9841-K";
  const expiryVal = "12/09/2030";

  drawField("NAME / SURNAME", nameVal, 280, 130);
  drawField("DATE OF BIRTH / DOB", dobVal, 280, 195, caseType === "altered");
  drawField("DOCUMENT NUMBER / ID NO", docNumVal, 520, 195);
  drawField("EXPIRY DATE / VALID UNTIL", expiryVal, 280, 260);
  drawField("NATIONALITY / ISSUING AUTHORITY", "INDIAN / TRUSTLENS AUTH", 520, 260);
  drawField("ADDRESS / JURISDICTION", "42 INNOVATION WAY, TECH PARK, BENGALURU", 280, 325);

  // Chip graphic
  ctx.fillStyle = "#c5ab57";
  ctx.fillRect(photoX + photoW + 30, 360, 52, 38);
  ctx.strokeStyle = "#e8cb6e";
  ctx.strokeRect(photoX + photoW + 30, 360, 52, 38);

  // Machine Readable Zone (MRZ) - 2 lines at the bottom (Passport/ID standard)
  ctx.fillStyle = "rgba(6, 12, 20, 0.9)";
  ctx.fillRect(20, height - 90, width - 40, 72);
  ctx.strokeStyle = "rgba(50, 90, 130, 0.4)";
  ctx.strokeRect(20, height - 90, width - 40, 72);

  ctx.fillStyle = "#c2d6ec";
  ctx.font = "bold 14px monospace";
  const mrzLine1 = `I<UTO${docNumVal.replace(/[^A-Z0-9]/g, "")}7<<<<<<<<<<<<<<<`;
  const mrzLine2 = `${dobVal.replace(/[^0-9]/g, "").substring(2, 8)}4M3009121UTO<<${nameVal.replace(/\s+/g, "<<")}<<<<<<`;

  ctx.fillText(mrzLine1.padEnd(36, "<").substring(0, 36), 40, height - 52);
  ctx.fillText(mrzLine2.padEnd(36, "<").substring(0, 36), 40, height - 30);

  // Export Document Blob -> File
  const docBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
  const docFile = new File([docBlob], `trustlens-specimen-${caseType}.png`, { type: "image/png" });

  // Generate corresponding matching or mismatched selfie if needed
  let selfieFile: File | undefined = undefined;
  if (caseType !== "no-selfie") {
    const sCanvas = document.createElement("canvas");
    sCanvas.width = 400;
    sCanvas.height = 400;
    const sCtx = sCanvas.getContext("2d");
    if (sCtx) {
      // Natural portrait selfie background
      const sBg = sCtx.createLinearGradient(0, 0, 400, 400);
      sBg.addColorStop(0, caseType === "mismatch" ? "#221832" : "#1a2c42");
      sBg.addColorStop(1, caseType === "mismatch" ? "#120c1e" : "#0d1825");
      sCtx.fillStyle = sBg;
      sCtx.fillRect(0, 0, 400, 400);

      // Head & body
      sCtx.fillStyle = caseType === "mismatch" ? "#886596" : "#628cb3";
      sCtx.beginPath();
      sCtx.arc(200, 160, 85, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.beginPath();
      sCtx.ellipse(200, 360, 140, 110, 0, 0, Math.PI, true);
      sCtx.fill();

      // Facial landmark guides
      sCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      sCtx.beginPath();
      sCtx.arc(170, 150, 8, 0, Math.PI * 2);
      sCtx.arc(230, 150, 8, 0, Math.PI * 2);
      sCtx.stroke();

      const selfieBlob = await new Promise<Blob>((res) => sCanvas.toBlob((b) => res(b!), "image/jpeg", 0.9));
      selfieFile = new File([selfieBlob], `selfie-${caseType}.jpg`, { type: "image/jpeg" });
    }
  }

  return { docFile, selfieFile };
}
