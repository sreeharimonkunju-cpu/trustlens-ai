import type { AnalysisResult } from "../types";
import { CheckCircle2, Download, Printer, Shield, ShieldCheck, X } from "lucide-react";

interface CertificateModalProps {
  result: AnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ result, isOpen, onClose }: CertificateModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="cert-modal-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="cert-toolbar no-print">
          <div className="cert-title-badge">
            <ShieldCheck size={18} /> Official KYC Audit Certificate
          </div>
          <div className="cert-actions">
            <button className="primary-btn" onClick={handlePrint}>
              <Printer size={16} /> Print / Save as PDF
            </button>
            <button className="icon-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        <div className="certificate-paper" id="printable-certificate">
          <div className="cert-border">
            <div className="cert-header">
              <div className="cert-brand">
                <div className="cert-logo"><Shield size={28} /></div>
                <div>
                  <h2>TRUSTLENS AI</h2>
                  <span>GLOBAL IDENTITY VERIFICATION & FRAUD RISK AUDIT</span>
                </div>
              </div>
              <div className="cert-meta">
                <b>CERTIFICATE OF SCREENING</b>
                <span>Report ID: {result.id}</span>
                <span>Issued: {new Date(result.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="cert-body">
              <div className="cert-badge-row">
                <div className={`cert-status-badge ${result.risk === "LOW RISK" ? "passed" : result.risk === "REVIEW" ? "review" : "failed"}`}>
                  <CheckCircle2 size={20} />
                  <span>{result.risk === "LOW RISK" ? "PASSED · VERIFIED" : result.risk}</span>
                </div>
                <div className="cert-score-box">
                  <span>OVERALL TRUST SCORE</span>
                  <strong>{result.score} / 100</strong>
                </div>
              </div>

              <div className="cert-grid">
                <div className="cert-section">
                  <h3>Subject & Document Details</h3>
                  <div className="cert-item">
                    <span>Verified Full Name</span>
                    <b>{result.identity.name}</b>
                  </div>
                  <div className="cert-item">
                    <span>Document Type</span>
                    <b>{result.documentType}</b>
                  </div>
                  <div className="cert-item">
                    <span>Document / ID Number</span>
                    <b>{result.identity.documentNumber}</b>
                  </div>
                  <div className="cert-item">
                    <span>Date of Birth</span>
                    <b>{result.identity.dob}</b>
                  </div>
                  <div className="cert-item">
                    <span>Expiry Date</span>
                    <b>{result.identity.expiry}</b>
                  </div>
                </div>

                <div className="cert-section">
                  <h3>Cryptographic & Forensic Signals</h3>
                  <div className="cert-item">
                    <span>Document Authenticity</span>
                    <b>{result.signals.document}%</b>
                  </div>
                  <div className="cert-item">
                    <span>Biometric Face Similarity</span>
                    <b>{result.signals.face !== null ? `${result.signals.face}%` : "No Selfie Provided"}</b>
                  </div>
                  <div className="cert-item">
                    <span>Error Level Analysis (ELA)</span>
                    <b>{result.forensics.manipulation}% Tampering Index ({result.forensics.level})</b>
                  </div>
                  <div className="cert-item">
                    <span>OCR Recognition Quality</span>
                    <b>{result.signals.ocr}% Confidence</b>
                  </div>
                  <div className="cert-item">
                    <span>SHA-256 Fingerprint</span>
                    <small className="mono-hash">{result.hash ? result.hash.substring(0, 32) + "..." : "COMPUTED"}</small>
                  </div>
                </div>
              </div>

              <div className="cert-footer">
                <div className="cert-signature">
                  <div className="sig-line">TrustLens Neural AI Core v2.4</div>
                  <span>Automated AI Verification Engine</span>
                </div>
                <div className="cert-seal">
                  <div className="seal-circle">
                    <span>TRUSTLENS</span>
                    <b>AUDITED</b>
                    <span>2026</span>
                  </div>
                </div>
                <div className="cert-signature">
                  <div className="sig-line">Certified Compliance Officer</div>
                  <span>NIST 800-63A & ISO 27001 Simulation Standard</span>
                </div>
              </div>
            </div>

            <div className="cert-disclaimer">
              Notice: This document screening report is generated by TrustLens AI for hackathon evaluation and KYC demo purposes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
