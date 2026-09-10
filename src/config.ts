export const RISK_THRESHOLDS = {
  low: 80,
  review: 50,
} as const;

export const SCORE_WEIGHTS = {
  document: 0.30,
  face: 0.25,
  identity: 0.20,
  quality: 0.15,
  ocr: 0.10,
} as const;

export const DEMO_FILES = {
  genuine: "demo-genuine-id.png",
  altered: "demo-altered-id.png",
  mismatch: "demo-mismatch-id.png",
  noSelfie: "demo-no-selfie-id.png",
} as const;