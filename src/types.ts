export type RiskLevel = "LOW RISK" | "REVIEW" | "HIGH RISK";
export type DemoCase = "genuine" | "altered" | "mismatch" | "no-selfie";

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
}

export interface AnalysisResult {
  id: string;
  score: number;
  risk: RiskLevel;
  signals: Signals;
  identity: IdentityData;
  forensics: {
    manipulation: number;
    level: "Low" | "Medium" | "High";
    indicators: string[];
  };
  face: {
    available: boolean;
    similarity: number | null;
    match: boolean | null;
  };
  consistency: Array<{ label: string; status: "match" | "warning"; detail?: string }>;
  positives: string[];
  risks: Array<{ title: string; severity: "Low" | "Medium" | "High"; contribution: number; explanation: string }>;
  demo: boolean;
  demoCase?: DemoCase;
  createdAt: string;
  documentName: string;
  documentType: string;
}