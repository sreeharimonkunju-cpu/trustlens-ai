import { motion } from "framer-motion";
import { Check, Cpu, Loader2, ScanLine, ShieldCheck, Zap } from "lucide-react";
import { SCAN_STEPS } from "../services/mockAI";

export function Scanner({
  currentStep,
  currentLabel,
}: {
  currentStep: number;
  currentLabel?: string;
}) {
  const percent = Math.min(100, Math.round((currentStep / SCAN_STEPS.length) * 100));

  return (
    <div className="scanner-card card">
      <div className="scanner-visual">
        <div className="scan-grid" />
        <motion.div
          className="scan-line"
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <div className="scanner-core">
          <Cpu size={36} />
          <span>NEURAL ENGINE</span>
          <div className="live-telemetry">
            <span className="pulse-dot" /> LIVE INFERENCE
          </div>
        </div>
      </div>

      <div className="scanner-copy">
        <div className="scanner-status-badge">
          <Loader2 size={13} className="spin-icon" />
          <span>STAGE {Math.min(SCAN_STEPS.length, currentStep || 1)} OF {SCAN_STEPS.length}</span>
        </div>
        <h2>{currentLabel || SCAN_STEPS[Math.max(0, currentStep - 1)] || "Initializing AI Pipeline..."}</h2>
        <p>
          Executing deep optical character extraction, Error Level Analysis (ELA) tampering heuristics, and biometric verification.
        </p>

        <div className="scanner-progress-bar-wrap">
          <div className="scanner-progress-text">
            <span>Overall Screening Progress</span>
            <b>{percent}%</b>
          </div>
          <div className="scanner-progress-track">
            <motion.div
              className="scanner-progress-fill"
              style={{ width: `${percent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="scanner-telemetry-strip">
          <div className="telemetry-pill">
            <Zap size={13} /> Optical OCR Engine: <b>Tesseract 7.0 Active</b>
          </div>
          <div className="telemetry-pill">
            <ShieldCheck size={13} /> Forensic Mode: <b>Pixel ELA Active</b>
          </div>
        </div>
      </div>

      <div className="timeline">
        {SCAN_STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={step}
              className={`timeline-step ${isDone ? "done" : isCurrent ? "current" : ""}`}
            >
              <div className="timeline-dot">
                {isDone ? (
                  <Check size={13} />
                ) : isCurrent ? (
                  <Loader2 size={13} className="spin-icon" />
                ) : (
                  <ScanLine size={13} />
                )}
              </div>
              <span>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}