import type { DemoCase } from "../types";

export interface DemoOption {
  id: DemoCase;
  label: string;
  badge: "Low Risk" | "High Risk" | "Review";
  description: string;
  features: string[];
}

export const demoOptions: DemoOption[] = [
  {
    id: "genuine",
    label: "Case 1: Genuine International ID",
    badge: "Low Risk",
    description: "Authentic passport/ID with valid MRZ, uniform compression, and matching biometric selfie.",
    features: ["Valid MRZ Checksum", "Clean ELA Forensics", "Biometric Match: ~96%"],
  },
  {
    id: "altered",
    label: "Case 2: Digitally Altered Document",
    badge: "High Risk",
    description: "Document with spliced date of birth, localized compression error, and font tampering.",
    features: ["ELA Heatmap Discrepancy", "Tampering Score > 75%", "Layout Inconsistency"],
  },
  {
    id: "mismatch",
    label: "Case 3: Biometric Face Mismatch",
    badge: "High Risk",
    description: "Valid ID document presented with a mismatched applicant selfie.",
    features: ["Face Similarity < 40%", "Biometric Warning", "Cross-Check Flagged"],
  },
  {
    id: "no-selfie",
    label: "Case 4: Single Document (No Selfie)",
    badge: "Review",
    description: "Valid identity document processed without a selfie, flagged for officer review.",
    features: ["OCR Extracted Cleanly", "Forensics Passed", "Manual Face Review Req."],
  },
];