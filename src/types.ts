export type RiskLevel = "LOW RISK" | "REVIEW" | "HIGH RISK";
export type DemoCase = "genuine" | "altered" | "mismatch" | "no-selfie";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Lead Compliance Auditor" | "Senior KYC Officer" | "Fraud Risk Analyst" | "Hackathon Evaluator";
  organization: string;
  avatarUrl?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export interface Signals {
  document: number;
  face: number | null;
  identity: number;
  quality: number;
  ocr: number;
}

export interface IdentityData {
  name: string;
  dob: string;
  documentNumber: string;
  expiry: string;
  address: string;
  documentTypeDetected?: string;
  nationality?: string;
  gender?: string;
}

export interface DocumentBoundingBox {
  label: "Photo" | "Name" | "Date of Birth" | "Document Number" | "Expiry" | "Address" | "Anomaly";
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  confidence: number;
  text?: string;
}

export interface ForensicsData {
  manipulation: number;
  level: "Low" | "Medium" | "High";
  indicators: string[];
  elaScore: number;
  elaHeatmapUrl?: string;
  sharpnessScore: number;
  glareDetected: boolean;
  metadataClean: boolean;
  aspectRatioValid: boolean;
}

export interface AnalysisResult {
  id: string;
  score: number;
  risk: RiskLevel;
  signals: Signals;
  identity: IdentityData;
  forensics: ForensicsData;
  face: {
    available: boolean;
    similarity: number | null;
    match: boolean | null;
    docFaceCropUrl?: string;
    selfieFaceCropUrl?: string;
    livenessScore?: number;
    livenessPassed?: boolean;
    landmarksDetected?: boolean;
    featureMetrics?: {
      eyeDistanceRatio: number;
      structuralSimilarity: number;
      colorCorrelation: number;
      textureMatch: number;
    };
  };
  consistency: Array<{ label: string; status: "match" | "warning"; detail?: string }>;
  positives: string[];
  risks: Array<{ title: string; severity: "Low" | "Medium" | "High"; contribution: number; explanation: string }>;
  demo: boolean;
  demoCase?: DemoCase;
  createdAt: string;
  documentName: string;
  documentType: string;
  documentPreviewUrl?: string;
  selfiePreviewUrl?: string;
  rawOcrText?: string;
  boundingBoxes?: DocumentBoundingBox[];
  hash?: string;
  auditor?: string;
}