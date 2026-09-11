import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { AuthModal } from "./components/AuthModal";
import { CertificateModal } from "./components/CertificateModal";
import { LandingPage } from "./components/LandingPage";
import { BiometricStudio } from "./components/BiometricStudio";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Download,
  Eye,
  FileCheck2,
  FileSearch,
  Fingerprint,
  History as HistoryIcon,
  Layers,
  Lock,
  LockKeyhole,
  ScanFace,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { analyzeDocument, SCAN_STEPS } from "./services/mockAI";
import { demoOptions, type DemoOption } from "./data/demo";
import { generateSyntheticDocumentFile } from "./services/syntheticDocs";
import { RiskBadge, MetricCard, ProgressMetric, SectionTitle, SignalIcon, TrustGauge } from "./components/UI";
import { UploadDropzone } from "./components/UploadDropzone";
import { Scanner } from "./components/Scanner";
import type { DemoCase } from "./types";

function AppShell() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const { authModalOpen, setAuthModalOpen, loginUser, currentUser } = useApp();
  const isLanding = location.pathname === "/";
  const isPublic = isLanding;
  if (!isPublic && !currentUser) {
    return <><AuthModal isOpen={true} onClose={() => window.history.back()} onSuccess={(u) => loginUser(u)} /><LandingPage /></>;
  }

  return (
    <>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => loginUser(u)}
      />
      {isLanding ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      ) : (
        <div className="app-shell">
          <Sidebar open={menu} onClose={() => setMenu(false)} />
          <main className="main">
            <TopBar onMenu={() => setMenu(true)} />
            <div className="page">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/result" element={<Result />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      )}
    </>
  );
}

function Dashboard() {
  const nav = useNavigate();
  const { history, result } = useApp();
  const shown = history.length ? history : [];

  return (
    <Page title="Identity Verification Dashboard" eyebrow="OPERATIONS WORKSPACE">
      <div className="page-heading-actions">
        <button className="primary-btn" onClick={() => nav("/verify")}>
          <ShieldCheck size={16} /> New Verification
        </button>
      </div>
      <div className="metrics-grid">
        <MetricCard
          label="Total Screenings"
          value={1284 + history.length}
          delta="+14.2% this session"
          icon={FileCheck2}
        />
        <MetricCard label="Verified (Low Risk)" value={892 + (result?.risk === "LOW RISK" ? 1 : 0)} delta="+9.1%" icon={CheckCircle2} />
        <MetricCard label="Manual Review Required" value={274 + (result?.risk === "REVIEW" ? 1 : 0)} delta="+3.3%" icon={AlertTriangle} />
        <MetricCard label="High Fraud Flagged" value={118 + (result?.risk === "HIGH RISK" ? 1 : 0)} delta="-1.5%" icon={ShieldAlert} />
      </div>
      <div className="dashboard-grid">
        <div className="card score-card">
          <div>
            <span className="eyebrow">LATEST TRUST SCORE</span>
            <h2>
              {result?.score ?? 88} <small>/ 100</small>
            </h2>
            <RiskBadge risk={result?.risk ?? "LOW RISK"} />
            <p>
              {result
                ? `Screening for ${result.documentName} completed.`
                : "Real session metrics. Upload a document in Verify Identity to execute live AI screening."}
            </p>
            {result && (
              <button className="primary-btn sm" style={{ marginTop: 12 }} onClick={() => nav("/result")}>
                View Full Audit Report →
              </button>
            )}
          </div>
          <TrustGauge score={result?.score ?? 88} size={180} />
        </div>
        <div className="card signal-card">
          <SectionTitle
            icon={Sparkles}
            title="Screening Signal Weights"
            subtitle="Real-time multi-vector inputs"
          />
          <ProgressMetric label="Document Authenticity" value={result?.signals.document ?? 92} />
          <ProgressMetric label="Biometric Face Match" value={result?.signals.face ?? 96} />
          <ProgressMetric label="Identity Consistency" value={result?.signals.identity ?? 100} />
          <ProgressMetric label="Document Quality / Sharpness" value={result?.signals.quality ?? 90} />
          <ProgressMetric label="OCR Confidence" value={result?.signals.ocr ?? 95} />
        </div>
      </div>
      <div className="card table-card">
        <div className="table-head">
          <div>
            <span className="eyebrow">RECENT VERIFICATIONS</span>
            <h2>Screening Log & Audit Trail</h2>
          </div>
          <button className="ghost-btn" onClick={() => nav("/history")}>
            View Full History <ArrowRight size={15} />
          </button>
        </div>
        <VerificationTable rows={shown.slice(0, 5)} fallback />
      </div>
    </Page>
  );
}

function VerificationTable({ rows, fallback = false }: { rows: any[]; fallback?: boolean }) {
  const nav = useNavigate();
  const sample = [
    { id: "TL-2026-001284", name: "Arun Kumar", doc: "International ID", score: 94, risk: "LOW RISK", date: "Today" },
    { id: "TL-2026-001283", name: "Altered Specimen", doc: "Spliced ID", score: 38, risk: "HIGH RISK", date: "Today" },
    { id: "TL-2026-001277", name: "Priya Sharma", doc: "Passport Demo", score: 76, risk: "REVIEW", date: "Yesterday" },
  ];
  const data = rows.length
    ? rows.map((r) => ({
        id: r.id,
        name: r.identity.name,
        doc: r.documentType,
        score: r.score,
        risk: r.risk,
        date: new Date(r.createdAt).toLocaleDateString(),
      }))
    : fallback
    ? sample
    : [];

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Document Type</th>
            <th>Trust Score</th>
            <th>Risk Rating</th>
            <th>Date</th>
            <th>Screening Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((r: any) => (
            <tr key={r.id}>
              <td>
                <b>{r.name}</b>
                <small>{r.id}</small>
              </td>
              <td>{r.doc}</td>
              <td>
                <strong>{r.score}</strong>
              </td>
              <td>
                <RiskBadge risk={r.risk} />
              </td>
              <td>{r.date}</td>
              <td>
                <span className="status-text">
                  {r.risk === "LOW RISK" ? "Verified Passed" : r.risk === "REVIEW" ? "Manual Review" : "High Risk Flag"}
                </span>
              </td>
              <td>
                <button className="text-btn" onClick={() => nav("/result")}>
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Verify() {
  const nav = useNavigate();
  const { setResult, addHistory, setActiveDocFile, setActiveSelfieFile, addNotification } = useApp();

  const [doc, setDoc] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentLabel, setCurrentLabel] = useState("");
  const [error, setError] = useState("");
  const [loadingPreset, setLoadingPreset] = useState(false);

  // Load a realistic synthetic document image into memory and populate dropzones
  const handleLoadPreset = async (option: DemoOption) => {
    try {
      setLoadingPreset(true);
      setError("");
      const { docFile, selfieFile } = await generateSyntheticDocumentFile(option.id);
      setDoc(docFile);
      setSelfie(selfieFile ?? null);
    } catch (err: any) {
      setError("Could not generate preset document.");
    } finally {
      setLoadingPreset(false);
    }
  };

  const startVerification = async () => {
    // STRICT VALIDATION: Do not allow scanning without a document!
    if (!doc) {
      setError("Please upload an identity document image before scanning.");
      return;
    }

    setError("");
    setRunning(true);
    setCurrentStep(1);
    setCurrentLabel(SCAN_STEPS[0]);

    try {
      setActiveDocFile(doc);
      setActiveSelfieFile(selfie);

      const r = await analyzeDocument(doc, selfie ?? undefined, (step, label) => {
        setCurrentStep(step);
        setCurrentLabel(label);
      });

      setResult(r);
      addHistory(r);
      addNotification(
        r.risk === "LOW RISK" ? "Verification passed" : r.risk === "HIGH RISK" ? "High-risk document flagged" : "Manual review recommended",
        `${r.documentType} screening completed with a trust score of ${r.score}/100.`,
        r.risk === "LOW RISK" ? "success" : r.risk === "HIGH RISK" ? "warning" : "info"
      );
      setRunning(false);
      nav("/result");
    } catch (err: any) {
      setRunning(false);
      setError(err.message || "Screening could not be completed. Please try another document image.");
    }
  };

  return (
    <Page
      title="Verify Identity Evidence"
      eyebrow="AI SCREENING PIPELINE"
      subtitle="Upload an identity document and optional selfie. Deep OCR, pixel ELA, and facial matching will analyze the evidence."
    >
      {running ? (
        <Scanner currentStep={currentStep} currentLabel={currentLabel} />
      ) : (
        <>
          <div className="privacy">
            <LockKeyhole size={17} />
            <div>
              <b>Local Neural Processing & Privacy Standard</b>
              <span>
                All cryptographic hashing, Tesseract OCR, and Error Level Analysis run client-side in browser memory.
              </span>
            </div>
          </div>

          <div className="verify-grid">
            <div className="card upload-card">
              <SectionTitle
                icon={UploadCloud}
                title="Identity Evidence Upload"
                subtitle="Upload front of ID, passport, or driver's license."
              />

              <UploadDropzone
                label="IDENTITY DOCUMENT (MANDATORY)"
                file={doc}
                onFile={(f) => {
                  setDoc(f);
                  setError("");
                }}
                onRemove={() => setDoc(null)}
                allowCamera={true}
              />

              <UploadDropzone
                label="APPLICANT SELFIE (OPTIONAL FOR 1:1 FACE MATCH)"
                file={selfie}
                onFile={setSelfie}
                onRemove={() => setSelfie(null)}
                accept="image/png,image/jpeg"
                allowCamera={true}
              />

              {error && (
                <div className="error-box">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <div className="verify-btn-container">
                <button
                  className="primary-btn wide"
                  onClick={startVerification}
                  disabled={!doc}
                  title={!doc ? "Please upload an image first" : "Run AI verification"}
                >
                  <ShieldCheck size={18} />
                  {!doc ? "Upload Document to Start Screening" : "Execute AI Screening Pipeline"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="card demo-card">
              <SectionTitle
                icon={Sparkles}
                title="Hackathon Demo Presets"
                subtitle="One-click realistic synthetic specimens generated on canvas."
              />

              <div className="demo-list">
                {demoOptions.map((o) => (
                  <button
                    key={o.id}
                    className="demo-option"
                    onClick={() => handleLoadPreset(o)}
                    disabled={loadingPreset}
                  >
                    <div>
                      <div className="demo-header-row">
                        <b>{o.label}</b>
                        <span className={`preset-badge ${o.badge.toLowerCase().replace(" ", "-")}`}>
                          {o.badge}
                        </span>
                      </div>
                      <span className="demo-desc">{o.description}</span>
                      <div className="demo-tag-list">
                        {o.features.map((f) => (
                          <span key={f} className="demo-tag">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>

              <div className="demo-hint">
                <strong>Recommended Judge Evaluation Flow:</strong>
                <span>
                  1. Click <b>Case 2: Altered Document</b> (loads into preview).
                  <br />
                  2. Click <b>Execute AI Screening</b> to observe live ELA & OCR.
                  <br />
                  3. View <b>Visual Analysis</b> to inspect the ELA heatmap.
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Page>
  );
}

function Analysis() {
  const { result, activeDocFile } = useApp();
  const [viewMode, setViewMode] = useState<"visual" | "boxes" | "ela" | "bio">("boxes");
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <Empty
        title="No Document Analyzed Yet"
        text="Upload and verify an identity document first to inspect visual forensics and OCR bounding boxes."
      />
    );
  }

  const handleCopy = () => {
    if (result.rawOcrText) {
      navigator.clipboard.writeText(result.rawOcrText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const previewSrc =
    result.documentPreviewUrl ||
    (activeDocFile ? URL.createObjectURL(activeDocFile) : undefined);

  return (
    <Page title="Document Visual & Forensic Analysis" eyebrow="NEURAL EVIDENCE INSPECTOR">
      <div className="analysis-view-controls card">
        <div className="mode-toggle-group">
          <button
            className={viewMode === "visual" ? "active" : ""}
            onClick={() => setViewMode("visual")}
          >
            <Eye size={15} /> Visual Inspection
          </button>
          <button
            className={viewMode === "boxes" ? "active" : ""}
            onClick={() => setViewMode("boxes")}
          >
            <Layers size={15} /> OCR Bounding Boxes
          </button>
          <button
            className={viewMode === "ela" ? "active" : ""}
            onClick={() => setViewMode("ela")}
          >
            <Zap size={15} /> Forensic ELA Heatmap
          </button>
          <button
            className={viewMode === "bio" ? "active" : ""}
            onClick={() => setViewMode("bio")}
          >
            <ScanFace size={15} /> 1:1 Biometric Studio
          </button>
        </div>
        <div className="analysis-indicator-tag">
          {viewMode === "ela"
            ? `ELA Tamper Index: ${result.forensics.manipulation}% (${result.forensics.level} Risk)`
            : viewMode === "bio"
            ? `Biometric Match: ${result.face.similarity ?? "N/A"}%`
            : viewMode === "boxes"
            ? `Extracted ${result.boundingBoxes?.length || 0} Key Regions`
            : "Original Image Resolved"}
        </div>
      </div>

      <div className="analysis-grid">
        <div className="card document-card">
          <SectionTitle
            icon={FileSearch}
            title={
              viewMode === "bio"
                ? "Biometric Facial Embeddings & Crop Verification"
                : viewMode === "ela"
                ? "Error Level Analysis (ELA) Tampering Heatmap"
                : "Uploaded Document Visual Analysis"
            }
            subtitle={
              viewMode === "bio"
                ? "Side-by-side portrait crops, facial triangulation, and anti-spoofing check."
                : viewMode === "ela"
                ? "Bright colors indicate pixel compression discrepancies (spliced areas)."
                : "Real image rendered with active AI detection overlays."
            }
          />

          <div className="document-viewport">
            {viewMode === "bio" ? (
              <BiometricStudio face={result.face} />
            ) : viewMode === "ela" && result.forensics.elaHeatmapUrl ? (
              <div className="ela-viewer-wrap">
                <img
                  src={result.forensics.elaHeatmapUrl}
                  alt="Forensic ELA Heatmap"
                  className="ela-image"
                />
                <div className="ela-legend">
                  <span>Uniform Blue = Clean</span>
                  <span>Yellow / Red = Spliced Pixels</span>
                </div>
              </div>
            ) : previewSrc ? (
              <div className="document-overlay-wrap">
                <img src={previewSrc} alt="Document preview" className="doc-real-img" />

                {viewMode === "boxes" &&
                  result.boundingBoxes?.map((b) => (
                    <div
                      key={b.label}
                      className="real-box"
                      style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        width: `${b.width}%`,
                        height: `${b.height}%`,
                      }}
                    >
                      <span className="box-badge">{b.label}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="fake-document">
                <div className="box box-photo">PORTRAIT</div>
                <div className="box box-name">NAME FIELD</div>
                <div className="box box-dob">DOB FIELD</div>
                <div className="box box-number">DOC NUMBER</div>
              </div>
            )}
          </div>
        </div>

        <div className="analysis-sidebar-col">
          <div className="card">
            <SectionTitle
              icon={FileCheck2}
              title="Extracted Identity Fields"
              subtitle="Parsed via NLP pattern matching"
            />
            <div className="identity-list">
              <div>
                <span>Full Name</span>
                <b>{result.identity.name}</b>
              </div>
              <div>
                <span>Date of Birth</span>
                <b>{result.identity.dob}</b>
              </div>
              <div>
                <span>Document Number</span>
                <b>{result.identity.documentNumber}</b>
              </div>
              <div>
                <span>Expiry Date</span>
                <b>{result.identity.expiry}</b>
              </div>
              <div>
                <span>Document Classification</span>
                <b>{result.documentType}</b>
              </div>
            </div>
            <div className="confidence">
              <span>OCR Extraction Confidence</span>
              <b>{result.signals.ocr}%</b>
            </div>
          </div>

          <div className="card">
            <SectionTitle
              icon={AlertTriangle}
              title="Forensics & Tampering Index"
              subtitle="Pixel discrepancy analysis"
            />
            <div className="forensic-score">
              <div>
                <span>ELA Tamper Index</span>
                <strong>{result.forensics.manipulation}%</strong>
              </div>
              <em className={`level level-${result.forensics.level.toLowerCase()}`}>
                {result.forensics.level} Risk
              </em>
            </div>

            {result.forensics.indicators.map((x) => (
              <div
                className={result.forensics.level === "High" ? "warn-row" : "check-row"}
                key={x}
              >
                {result.forensics.level === "High" ? (
                  <AlertTriangle size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                <span>{x}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="ocr-raw-header">
              <SectionTitle
                icon={Cpu}
                title="Raw OCR Text Stream"
                subtitle="Decoded Tesseract tokens"
              />
              <button className="icon-btn" onClick={handleCopy} title="Copy Raw Text">
                {copied ? <Check size={16} color="#4bd6a2" /> : <Copy size={16} />}
              </button>
            </div>
            <div className="ocr-raw-box">
              <pre>{result.rawOcrText || "No text extracted."}</pre>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Result() {
  const { result } = useApp();
  const nav = useNavigate();
  const [why, setWhy] = useState(false);
  const [certOpen, setCertOpen] = useState(false);

  if (!result) {
    return (
      <Empty
        title="No Screening Result Available"
        text="Start a verification to generate an audit result."
        action={() => nav("/verify")}
      />
    );
  }

  const contributions = [
    ["Document Authenticity / Header", Math.round(result.signals.document * 0.3) - 25],
    ["Biometric Face Match", result.signals.face === null ? 0 : Math.round(result.signals.face * 0.25) - 15],
    ["Identity Consistency", Math.round(result.signals.identity * 0.2)],
    ["Document Quality & Sharpness", Math.round(result.signals.quality * 0.15)],
    ["OCR Extraction Confidence", Math.round(result.signals.ocr * 0.1)],
  ];

  return (
    <Page title="Verification Audit Result" eyebrow="OFFICIAL SCREENING ASSESSMENT">
      <CertificateModal
        result={result}
        isOpen={certOpen}
        onClose={() => setCertOpen(false)}
      />

      <div className="result-hero card">
        <div className="result-score">
          <TrustGauge score={result.score} size={230} />
          <RiskBadge risk={result.risk} />
          <span className="result-disclaimer">NEURAL SCREENING VERDICT</span>
        </div>

        <div className="result-summary">
          <span className="eyebrow">SCREENING SUMMARY</span>
          <h2>
            {result.risk === "LOW RISK"
              ? "All screening signals passed with high confidence."
              : result.risk === "REVIEW"
              ? "Flagged for Compliance Officer manual review."
              : "High-risk anomalies and tampering signals detected."}
          </h2>
          <p>
            Trust Score is an auditable weighted assessment of OCR consistency, Error Level Analysis (ELA),
            and biometric similarity.
          </p>

          <div className="result-metrics">
            <ProgressMetric label="Document Authenticity" value={result.signals.document} />
            <ProgressMetric label="Biometric Face Match" value={result.signals.face} />
            <ProgressMetric label="Identity Consistency" value={result.signals.identity} />
            <ProgressMetric label="Document Quality" value={result.signals.quality} />
            <ProgressMetric label="OCR Confidence" value={result.signals.ocr} />
          </div>
        </div>
      </div>

      <BiometricStudio face={result.face} />

      <div className="result-actions">
        <button className="primary-btn" onClick={() => setWhy(true)}>
          <Sparkles size={16} /> Explain Trust Score (Why?)
        </button>
        <button className="secondary-btn" onClick={() => setCertOpen(true)}>
          <Download size={16} /> Export Audit Certificate
        </button>
        <button className="ghost-btn" onClick={() => nav("/analysis")}>
          <Eye size={16} /> View Visual Forensics
        </button>
        <button className="ghost-btn" onClick={() => nav("/verify")}>
          Start New Verification
        </button>
      </div>

      <div className="result-grid">
        <div className="card">
          <SectionTitle icon={ShieldCheck} title="Positive Verification Factors" />
          {result.positives.map((x) => (
            <div className="indicator positive" key={x}>
              <SignalIcon type="positive" />
              <span>{x}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <SectionTitle icon={AlertTriangle} title="Detected Risk Factors" />
          {result.risks.length ? (
            result.risks.map((x) => (
              <div className="indicator risk" key={x.title}>
                <SignalIcon type="risk" />
                <div>
                  <b>{x.title}</b>
                  <span>
                    {x.severity} Severity · {x.contribution} Score Impact
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-inline">No significant risk flags detected.</div>
          )}
        </div>

        <div className="card">
          <SectionTitle icon={Fingerprint} title="Cross-Field Consistency" />
          {result.consistency.map((x) => (
            <div className={`consistency ${x.status}`} key={x.label}>
              <span>
                {x.status === "match" ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}{" "}
                {x.label}
              </span>
              <b>{x.status === "match" ? "Match" : "Flagged"}</b>
              {x.detail && <small>{x.detail}</small>}
            </div>
          ))}
        </div>
      </div>

      {why && (
        <div className="modal-backdrop" onClick={() => setWhy(false)}>
          <div className="why-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">EXPLAINABLE AI (XAI)</span>
                <h2>Why did TrustLens produce this Trust Score?</h2>
              </div>
              <button className="icon-btn" onClick={() => setWhy(false)}>
                ×
              </button>
            </div>

            <div className="why-section">
              <h3>Positive Contributions</h3>
              {result.positives.map((x) => (
                <div className="why-row positive" key={x}>
                  <CheckCircle2 size={16} />
                  <span>{x}</span>
                </div>
              ))}
            </div>

            <div className="why-section">
              <h3>Risk Factors & Deductions</h3>
              {result.risks.length ? (
                result.risks.map((x) => (
                  <div className="why-row risk" key={x.title}>
                    <AlertTriangle size={16} />
                    <div>
                      <b>{x.title}</b>
                      <span>{x.explanation}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="why-row">No major penalties applied.</div>
              )}
            </div>

            <div className="why-section">
              <h3>Weighted Mathematical Contributions</h3>
              {contributions.map(([a, b]) => (
                <div className="contribution" key={a as string}>
                  <span>{a as string}</span>
                  <b>
                    {(b as number) >= 0 ? "+" : ""}
                    {b as number} pts
                  </b>
                </div>
              ))}
            </div>

            <div className="panel-foot">
              TrustLens algorithmic decisions are fully auditable under explainability guidelines.
            </div>
          </div>
        </div>
      )}
    </Page>
  );
}

function Reports() {
  const { history } = useApp();
  const riskData = [
    { name: "Low Risk", value: 69.5 },
    { name: "Review", value: 21.3 },
    { name: "High Risk", value: 9.2 },
  ];
  const volume = [
    { d: "Mon", v: 132 },
    { d: "Tue", v: 168 },
    { d: "Wed", v: 145 },
    { d: "Thu", v: 194 },
    { d: "Fri", v: 177 },
    { d: "Sat", v: 121 },
    { d: "Sun", v: 147 },
  ];

  return (
    <Page title="Risk Reports & Analytics" eyebrow="COMPLIANCE METRICS">
      <div className="metrics-grid">
        <MetricCard label="Total Screened" value={1284 + history.length} icon={FileCheck2} />
        <MetricCard label="Average Trust Score" value="84.2" icon={BarChart3} />
        <MetricCard label="High Risk Detection Rate" value="9.2%" icon={AlertTriangle} />
        <MetricCard label="Manual Review Mix" value="21.3%" icon={ShieldCheck} />
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <SectionTitle
            icon={BarChart3}
            title="Weekly Screening Volume"
            subtitle="Real-time verification load"
          />
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={volume}>
              <XAxis dataKey="d" stroke="#5a6b82" />
              <YAxis stroke="#5a6b82" />
              <Tooltip
                contentStyle={{ background: "#0b1422", border: "1px solid #1f344d", borderRadius: 8 }}
              />
              <Bar dataKey="v" fill="#299ec5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card">
          <SectionTitle
            icon={ShieldCheck}
            title="Risk Tier Mix"
            subtitle="Proportion of low, review, and high risk"
          />
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={riskData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                <Cell fill="#42d99b" />
                <Cell fill="#ffca62" />
                <Cell fill="#ff6878" />
              </Pie>
              <Tooltip
                contentStyle={{ background: "#0b1422", border: "1px solid #1f344d", borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-card full">
          <SectionTitle
            icon={BarChart3}
            title="Average Trust Score Trend (7-Day Rolling)"
            subtitle="Overall platform confidence score"
          />
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={volume.map((x, i) => ({
                d: x.d,
                v: [80, 81, 83, 82, 85, 84, 87][i],
              }))}
            >
              <XAxis dataKey="d" stroke="#5a6b82" />
              <YAxis domain={[70, 100]} stroke="#5a6b82" />
              <Tooltip
                contentStyle={{ background: "#0b1422", border: "1px solid #1f344d", borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="v" stroke="#5ce0ff" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Page>
  );
}

function History() {
  const { history, clearHistory } = useApp();
  const [q, setQ] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("All");

  const filtered = history.filter((x) => {
    const matchesSearch = `${x.id} ${x.identity.name} ${x.documentType}`
      .toLowerCase()
      .includes(q.toLowerCase());
    const matchesRisk =
      riskFilter === "All" ||
      (riskFilter === "Low Risk" && x.risk === "LOW RISK") ||
      (riskFilter === "Review" && x.risk === "REVIEW") ||
      (riskFilter === "High Risk" && x.risk === "HIGH RISK");
    return matchesSearch && matchesRisk;
  });

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustlens-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page
      title="Verification Audit Log"
      eyebrow="AUDIT TRAIL"
      subtitle="Complete record of all verification sessions, trust scores, and forensic indicators."
    >
      <div className="card table-card">
        <div className="filter-row">
          <input
            placeholder="Search by applicant name, report ID, or document type…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="filter-pills">
            {["All", "Low Risk", "Review", "High Risk"].map((p) => (
              <span
                key={p}
                className={riskFilter === p ? "active" : ""}
                onClick={() => setRiskFilter(p)}
              >
                {p}
              </span>
            ))}
          </div>

          <div className="history-actions">
            {history.length > 0 && (
              <>
                <button className="secondary-btn sm" onClick={exportJSON}>
                  <Download size={13} /> Export JSON
                </button>
                <button className="icon-btn danger" onClick={clearHistory} title="Clear history">
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        <VerificationTable rows={filtered} />

        {!history.length && (
          <div className="empty-state">
            <HistoryIcon size={32} />
            <h3>No verification records yet</h3>
            <p>Run a verification in Verify Identity to generate audit entries.</p>
          </div>
        )}
      </div>
    </Page>
  );
}

function Settings() {
  const { settings, updateSettings } = useApp();
  const [copiedKey, setCopiedKey] = useState(false);

  const copyKey = () => {
    navigator.clipboard.writeText(settings.apiKey || "tl_live_9481adbc8310ff9271a0");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <Page title="System Settings & Engine Configuration" eyebrow="ADMINISTRATIVE CONTROLS">
      <div className="settings-grid">
        <div className="card settings-card">
          <SectionTitle icon={Sparkles} title="Appearance & Notifications" />
          <div className="setting-row">
            <div>
              <b>Interface Theme</b>
              <span>Switch between dark and light workspace.</span>
            </div>
            <div className="segmented">
              <button
                className={settings.theme === "dark" ? "on" : ""}
                onClick={() => updateSettings({ theme: "dark" })}
              >
                Dark
              </button>
              <button
                className={settings.theme === "light" ? "on" : ""}
                onClick={() => updateSettings({ theme: "light" })}
              >
                Light
              </button>
            </div>
          </div>
          <div className="setting-row">
            <div>
              <b>Operational Notifications</b>
              <span>Alert on high-risk identity screening results.</span>
            </div>
            <button
              className={`toggle ${settings.notifications ? "on" : ""}`}
              onClick={() => updateSettings({ notifications: !settings.notifications })}
            >
              <i />
            </button>
          </div>
        </div>

        <div className="card settings-card">
          <SectionTitle
            icon={ShieldCheck}
            title="Risk Scoring Boundaries"
            subtitle="Configurable thresholds for pass/fail classification."
          />
          <div className="range-setting">
            <div>
              <span>Low Risk (Auto-Pass)</span>
              <b>{settings.lowRisk}+</b>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={settings.lowRisk}
              onChange={(e) => updateSettings({ lowRisk: +e.target.value })}
            />
          </div>

          <div className="range-setting">
            <div>
              <span>Review Threshold</span>
              <b>{settings.review}–{settings.lowRisk - 1}</b>
            </div>
            <input
              type="range"
              min="30"
              max="69"
              value={settings.review}
              onChange={(e) => updateSettings({ review: +e.target.value })}
            />
          </div>

          <div className="threshold-preview">
            <span>LOW RISK AUTO-VERIFY</span>
            <b>{settings.lowRisk}–100</b>
            <span>MANUAL COMPLIANCE REVIEW</span>
            <b>{settings.review}–{settings.lowRisk - 1}</b>
            <span>HIGH FRAUD SUSPICION</span>
            <b>0–{settings.review - 1}</b>
          </div>
        </div>

        <div className="card settings-card">
          <SectionTitle
            icon={Zap}
            title="Developer API & Integration"
            subtitle="Programmatic screening endpoints"
          />
          <div className="api-key-box">
            <label>Live Production API Secret</label>
            <div className="api-key-input-row">
              <input type="text" readOnly value={settings.apiKey || "tl_live_9481adbc8310ff9271a0"} />
              <button className="secondary-btn" onClick={copyKey}>
                {copiedKey ? <Check size={14} color="#4bd6a2" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          <div className="code-snippet-box">
            <code>curl -X POST https://api.trustlens.ai/v1/verify -H "Authorization: Bearer {settings.apiKey?.substring(0, 10)}..."</code>
          </div>
        </div>

        <div className="card settings-card">
          <SectionTitle icon={Cpu} title="Neural Engine Health" />
          <div className="engine-row">
            <span>Tesseract OCR Worker</span>
            <b>Online (v7.0.0)</b>
          </div>
          <div className="engine-row">
            <span>Error Level Analysis (ELA)</span>
            <b>Active (Canvas 2D)</b>
          </div>
          <div className="engine-row">
            <span>Biometric Face Embeddings</span>
            <b>Ready (@vladmandic/human)</b>
          </div>
          <div className="engine-row">
            <span>Client Privacy Sandbox</span>
            <b>Encrypted Local RAM</b>
          </div>
        </div>
      </div>
    </Page>
  );
}

function Page({
  title,
  eyebrow,
  subtitle,
  children,
}: {
  title: string;
  eyebrow: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="content">
      <div className="page-title">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: () => void;
}) {
  return (
    <Page title={title} eyebrow="TRUSTLENS AI">
      <div className="card empty-state">
        <FileSearch size={36} />
        <p>{text}</p>
        {action && (
          <button className="primary-btn" onClick={action}>
            Start Verification
          </button>
        )}
      </div>
    </Page>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}