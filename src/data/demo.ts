import type { DemoCase } from "../types";

export const demoOptions: Array<{ id: DemoCase; label: string; description: string }> = [
  { id: "genuine", label: "Demo Case 1 — Genuine", description: "High confidence, low-risk screening result." },
  { id: "altered", label: "Demo Case 2 — Altered Document", description: "Simulated manipulation and layout anomalies." },
  { id: "mismatch", label: "Demo Case 3 — Identity Mismatch", description: "Simulated face and identity mismatch." },
  { id: "no-selfie", label: "Demo Case 4 — No Selfie", description: "Face comparison intentionally unavailable." },
];