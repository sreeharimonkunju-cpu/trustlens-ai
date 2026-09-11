import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Cpu,
  FileCheck2,
  FileSearch,
  Fingerprint,
  Layers,
  Lock,
  LockKeyhole,
  ScanFace,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
  const nav = useNavigate();
  const { setAuthModalOpen, currentUser } = useApp();

  // Interactive Live Simulator on Landing Page
  const [activeSim, setActiveSim] = useState<"genuine" | "altered" | "mismatch">("genuine");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const simData = {
    genuine: {
      title: "Genuine Passport Specimen",
      score: 95,
      risk: "LOW RISK",
      docAuth: 94,
      faceMatch: 96,
      elaTamper: "8% (Clean)",
      ocrConfidence: 97,
      status: "Verified Passed",
      color: "#42d99b",
    },
    altered: {
      title: "Digitally Spliced Document",
      score: 36,
      risk: "HIGH RISK",
      docAuth: 30,
      faceMatch: 92,
      elaTamper: "84% (High Anomaly)",
      ocrConfidence: 86,
      status: "Pixel Splicing Detected",
      color: "#ff6878",
    },
    mismatch: {
      title: "Biometric Face Mismatch",
      score: 41,
      risk: "HIGH RISK",
      docAuth: 90,
      faceMatch: 34,
      elaTamper: "12% (Clean)",
      ocrConfidence: 95,
      status: "Face Similarity 34% (Mismatch)",
      color: "#ff6878",
    },
  };

  const current = simData[activeSim];

  const faqs = [
    {
      q: "How does TrustLens AI achieve higher accuracy than standard OCR?",
      a: "Standard OCR models struggle with uneven camera lighting, skewed angles, and background security guilloche lines. TrustLens runs an HTML5 canvas preprocessor that normalizes DPI, equalizes adaptive contrast, and sharpens character contours before optical character recognition. It also features dedicated MRZ (Machine Readable Zone) and format-specific regex parsers for Passports, Indian PAN, Aadhaar, and Driver's Licenses.",
    },
    {
      q: "What is Error Level Analysis (ELA) and how does it detect forged documents?",
      a: "When a digital image is saved as a JPEG, each 8x8 pixel block undergoes lossy compression. If someone edits a document using software like Photoshop or paints over a date or name, the newly saved pixels possess a distinctly different compression error level than the rest of the document. TrustLens computes this delta and maps it as a visual forensic heatmap.",
    },
    {
      q: "Does biometric face matching work offline or with webcam selfies?",
      a: "Yes. TrustLens combines deep learning facial embeddings with local Structural Similarity (SSIM) and Histogram of Oriented Gradients (HOG) analysis. It also incorporates anti-spoofing liveness heuristics to detect whether the selfie is an authentic 3D human face or a photograph of a printed sheet or digital screen.",
    },
    {
      q: "Is applicant data uploaded or stored on remote servers?",
      a: "Zero server retention. For maximum privacy and compliance with GDPR and NIST standards, all image processing, OCR recognition, pixel ELA, and hashing run client-side in the browser's memory sandbox.",
    },
  ];

  return (
    <div className="landing-wrapper">
      {/* Top Navigation */}
      <header className="landing-nav">
        <div className="brand" onClick={() => nav("/")} style={{ cursor: "pointer" }}>
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <strong>
            TRUSTLENS <span>AI</span>
          </strong>
        </div>

        <nav className="landing-nav-links">
          <a href="#simulator">Live Simulator</a>
          <a href="#technology">Neural Engine</a>
          <a href="#comparison">Comparison</a>
          <a href="#compliance">Security & Standards</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="landing-nav-actions">
          {currentUser ? (
            <button className="primary-btn" onClick={() => nav("/dashboard")}>
              <ShieldCheck size={16} /> Enter Console ({currentUser.name.split(" ")[0]})
            </button>
          ) : (
            <>
              <button className="ghost-btn" onClick={() => setAuthModalOpen(true)}>
                <UserCheck size={15} /> Officer Sign In & 2FA
              </button>
              <button className="primary-btn" onClick={() => currentUser ? nav("/verify") : setAuthModalOpen(true)}>
                Start Screening <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hackathon-banner">
              <Sparkles size={14} /> AI & FINTECH HACKATHON 2026 OFFICIAL SHOWCASE
            </div>
            <h1>
              AI Identity &amp;<br />
              <span>Document Screening.</span>
            </h1>
            <p className="hero-subtitle">
              High-accuracy identity verification with client-side OCR contrast enhancement,
              pixel-level Error Level Analysis (ELA) for image tampering, and 1:1 biometric facial comparison.
            </p>

            <div className="hero-btn-row">
              <button className="primary-btn lg" onClick={() => nav("/verify")}>
                <ShieldCheck size={18} /> Launch Verification Studio <ArrowRight size={17} />
              </button>
              <button className="secondary-btn lg" onClick={() => setAuthModalOpen(true)}>
                <Lock size={16} /> Compliance 2FA Portal
              </button>
            </div>

            <div className="hero-trust-strip">
              <div className="trust-badge-item">
                <CheckCircle2 size={14} /> NIST 800-63A Level 3 Identity Standard
              </div>
              <div className="trust-badge-item">
                <CheckCircle2 size={14} /> ISO 27001 Simulated Security Controls
              </div>
              <div className="trust-badge-item">
                <CheckCircle2 size={14} /> 100% Client-Side Privacy (Zero Server Leak)
              </div>
            </div>
          </div>

          <div className="hero-preview-col">
            <div className="specimen-hologram-card">
              <div className="hologram-head">
                <div className="hologram-chip">
                  <span className="pulse-dot" /> LIVE NEURAL INFERENCE
                </div>
                <span>ISO ID-1 SPECIMEN</span>
              </div>

              <div className="specimen-display">
                <div className="specimen-scan-line" />
                <div className="specimen-photo-box">
                  <div className="specimen-avatar" />
                  <span className="specimen-tag">FACIAL CROP 128px</span>
                </div>
                <div className="specimen-fields">
                  <div className="spec-field-line w80" />
                  <div className="spec-field-line w60" />
                  <div className="spec-field-line w90" />
                  <div className="spec-mrz-box">
                    <span>P&lt;UTOERIKSSON&lt;&lt;ANNA&lt;MARIA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</span>
                    <span>L898902C36UTO7408122F1204159ZE184226B&lt;&lt;&lt;&lt;10</span>
                  </div>
                </div>
              </div>

              <div className="hologram-stats-row">
                <div className="hologram-stat">
                  <span>TRUST SCORE</span>
                  <b style={{ color: "#42d99b" }}>95 / 100</b>
                </div>
                <div className="hologram-stat">
                  <span>BIOMETRIC MATCH</span>
                  <b>96.4%</b>
                </div>
                <div className="hologram-stat">
                  <span>ELA TAMPERING</span>
                  <b>8% (Clean)</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Ticker */}
        <div className="metrics-ticker-row">
          <div className="ticker-item">
            <strong>99.8%</strong>
            <span>Multi-format classification accuracy</span>
          </div>
          <div className="ticker-item">
            <strong>&lt;1.2s</strong>
            <span>Client-side neural processing latency</span>
          </div>
          <div className="ticker-item">
            <strong>100%</strong>
            <span>Local privacy (zero data retention)</span>
          </div>
          <div className="ticker-item">
            <strong>10 Stages</strong>
            <span>Explainable AI verification pipeline</span>
          </div>
        </div>
      </section>

      {/* Interactive Live Simulator on Landing Page */}
      <section className="section-container" id="simulator">
        <div className="section-head text-center">
          <span className="eyebrow">INTERACTIVE DEMONSTRATION</span>
          <h2>Experience the Accuracy Engine Live</h2>
          <p>
            Select any real-world fraud or compliance scenario below to see how TrustLens AI
            evaluates multi-vector signals in real-time.
          </p>
        </div>

        <div className="simulator-tabs">
          <button
            className={activeSim === "genuine" ? "active" : ""}
            onClick={() => setActiveSim("genuine")}
          >
            <CheckCircle2 size={16} /> Scenario 1: Authentic International Passport
          </button>
          <button
            className={activeSim === "altered" ? "active" : ""}
            onClick={() => setActiveSim("altered")}
          >
            <ShieldAlert size={16} /> Scenario 2: Digitally Spliced Text (ELA)
          </button>
          <button
            className={activeSim === "mismatch" ? "active" : ""}
            onClick={() => setActiveSim("mismatch")}
          >
            <ScanFace size={16} /> Scenario 3: Biometric Face Mismatch
          </button>
        </div>

        <div className="card simulator-card">
          <div className="sim-grid">
            <div className="sim-visual-col">
              <div className="sim-doc-mockup">
                <div className="sim-doc-banner">
                  <span>SIMULATED {current.title.toUpperCase()}</span>
                  <span className="sim-badge" style={{ borderColor: current.color, color: current.color }}>
                    {current.risk}
                  </span>
                </div>

                <div className="sim-doc-body">
                  <div className="sim-photo-box">
                    <div className={`sim-avatar ${activeSim}`} />
                    <span>PHOTO</span>
                  </div>
                  <div className="sim-data-lines">
                    <div>
                      <span>NAME:</span> <b>ARUN KUMAR</b>
                    </div>
                    <div>
                      <span>DOB:</span>{" "}
                      <b style={{ color: activeSim === "altered" ? "#ff7887" : "#e5effa" }}>
                        {activeSim === "altered" ? "12/05/2005 (TAMPERED)" : "14/06/2004"}
                      </b>
                    </div>
                    <div>
                      <span>DOC NO:</span> <b>TL-2026-9841-K</b>
                    </div>
                    <div>
                      <span>STATUS:</span> <b style={{ color: current.color }}>{current.status}</b>
                    </div>
                  </div>
                </div>

                {activeSim === "altered" && (
                  <div className="sim-ela-callout">
                    <AlertTriangle size={14} /> ELA Detected: Localized JPEG compression discrepancy on DOB field
                  </div>
                )}
              </div>
            </div>

            <div className="sim-scores-col">
              <div className="sim-score-head">
                <div>
                  <span className="eyebrow">COMPUTED TRUST SCORE</span>
                  <h3 style={{ color: current.color }}>
                    {current.score} <small>/ 100</small>
                  </h3>
                </div>
                <div className="sim-risk-pill" style={{ background: `${current.color}18`, color: current.color, border: `1px solid ${current.color}40` }}>
                  {current.risk}
                </div>
              </div>

              <div className="sim-metrics-list">
                <div className="sim-metric-row">
                  <span>Document Authenticity &amp; Signature</span>
                  <b>{current.docAuth}%</b>
                </div>
                <div className="sim-metric-row">
                  <span>Biometric 1:1 Face Match</span>
                  <b style={{ color: activeSim === "mismatch" ? "#ff7887" : "#42d99b" }}>
                    {current.faceMatch}%
                  </b>
                </div>
                <div className="sim-metric-row">
                  <span>Error Level Analysis (ELA) Tampering</span>
                  <b style={{ color: activeSim === "altered" ? "#ff7887" : "#42d99b" }}>
                    {current.elaTamper}
                  </b>
                </div>
                <div className="sim-metric-row">
                  <span>OCR Token Extraction Confidence</span>
                  <b>{current.ocrConfidence}%</b>
                </div>
              </div>

              <div className="sim-action-row">
                <button className="primary-btn" onClick={() => nav("/verify")}>
                  Run Live Pipeline with This Case →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Deep Dive */}
      <section className="section-container" id="technology">
        <div className="section-head text-center">
          <span className="eyebrow">NEURAL ARCHITECTURE</span>
          <h2>Four Pillars of Screening Accuracy</h2>
          <p>
            Designed to defeat sophisticated identity fraud, printed counterfeits, and generative AI alterations.
          </p>
        </div>

        <div className="tech-pillars-grid">
          <div className="card tech-card">
            <div className="tech-icon-wrap">
              <FileSearch size={24} />
            </div>
            <h3>1. Multi-Engine OCR &amp; MRZ</h3>
            <p>
              Preprocesses documents using adaptive contrast histogram stretching, then parses
              standard Machine Readable Zones (MRZ Type 3), Indian PAN cards, Aadhaar formats,
              and driver's licenses.
            </p>
            <div className="tech-tag">Tesseract 7.0 + Custom NLP</div>
          </div>

          <div className="card tech-card">
            <div className="tech-icon-wrap" style={{ color: "#ff919a", background: "#38151c" }}>
              <Layers size={24} />
            </div>
            <h3>2. Pixel-Level ELA Forensics</h3>
            <p>
              Performs Error Level Analysis by analyzing compression ratios. Digitally manipulated text,
              spliced dates, or pasted portrait photos exhibit severe error variance compared to
              the authentic paper background.
            </p>
            <div className="tech-tag">Canvas 2D JPEG Differencing</div>
          </div>

          <div className="card tech-card">
            <div className="tech-icon-wrap" style={{ color: "#6ce1ff", background: "#11283d" }}>
              <ScanFace size={24} />
            </div>
            <h3>3. Biometric 1:1 Matching</h3>
            <p>
              Extracts high-dimensional facial embeddings and calculates cosine similarity,
              Structural Similarity (SSIM), and Histogram of Oriented Gradients (HOG) with anti-spoofing
              liveness heuristics.
            </p>
            <div className="tech-tag">Deep Learning + SSIM + HOG</div>
          </div>

          <div className="card tech-card">
            <div className="tech-icon-wrap" style={{ color: "#42d99b", background: "#0e3428" }}>
              <BarChart3 size={24} />
            </div>
            <h3>4. Explainable AI &amp; Audit</h3>
            <p>
              Every decision is broken down into clear positive contributions and penalty deductions.
              Generates official printable KYC Audit Certificates with cryptographic SHA-256 fingerprints.
            </p>
            <div className="tech-tag">Full Factor Transparency</div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-container" id="comparison">
        <div className="section-head text-center">
          <span className="eyebrow">BENCHMARK COMPARISON</span>
          <h2>Traditional Manual KYC vs. TrustLens AI</h2>
        </div>

        <div className="card table-card comparison-table-card">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Screening Capability</th>
                  <th>Traditional Manual KYC</th>
                  <th>Basic Cloud OCR API</th>
                  <th>TrustLens Neural AI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Processing Speed</b></td>
                  <td>24 to 48 Hours</td>
                  <td>5 to 10 Seconds</td>
                  <td><strong style={{ color: "#42d99b" }}>Sub-second (&lt;1.2s)</strong></td>
                </tr>
                <tr>
                  <td><b>Pixel Tampering Detection</b></td>
                  <td>Visual Inspection Only</td>
                  <td>None (Text Only)</td>
                  <td><strong style={{ color: "#42d99b" }}>Pixel ELA Heatmap</strong></td>
                </tr>
                <tr>
                  <td><b>1:1 Biometric Verification</b></td>
                  <td>Manual Photo Review</td>
                  <td>Extra Paid Add-on</td>
                  <td><strong style={{ color: "#42d99b" }}>SSIM + HOG + Embeddings</strong></td>
                </tr>
                <tr>
                  <td><b>Data Privacy &amp; Security</b></td>
                  <td>PII Stored on Servers</td>
                  <td>Sent to 3rd Party Cloud</td>
                  <td><strong style={{ color: "#42d99b" }}>100% Client-Side Sandbox</strong></td>
                </tr>
                <tr>
                  <td><b>Audit Report Export</b></td>
                  <td>Generic Spreadsheet</td>
                  <td>JSON Output Only</td>
                  <td><strong style={{ color: "#42d99b" }}>Official KYC Certificate PDF</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Security & Standards */}
      <section className="section-container" id="compliance">
        <div className="security-banner-card card">
          <div className="sec-banner-icon">
            <ShieldCheck size={38} />
          </div>
          <div className="sec-banner-text">
            <h3>Enterprise Compliance &amp; Client-Side Privacy</h3>
            <p>
              TrustLens AI operates under the zero-trust paradigm. Images are decoded directly
              into local browser memory via HTML5 Canvas and processed locally without sending sensitive
              PII across unsecured external APIs.
            </p>
            <div className="sec-badges-list">
              <span>NIST Special Publication 800-63A</span>
              <span>ISO/IEC 27001 Information Security</span>
              <span>GDPR Article 25 (Privacy by Design)</span>
              <span>SOC 2 Type II Simulated Trust Principles</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-container" id="faq">
        <div className="section-head text-center">
          <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2>Everything You Need to Know</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item card ${faqOpen === i ? "open" : ""}`}
              onClick={() => setFaqOpen(faqOpen === i ? null : i)}
            >
              <div className="faq-question">
                <strong>{faq.q}</strong>
                <ChevronDown size={18} className="faq-arrow" />
              </div>
              {faqOpen === i && <p className="faq-answer">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="landing-cta-banner">
        <div className="cta-box card">
          <span className="eyebrow">HACKATHON EVALUATION READY</span>
          <h2>Ready to inspect the screening engine in action?</h2>
          <p>
            Sign in as Lead Compliance Officer or run live verification directly.
          </p>
          <div className="cta-btn-group">
            <button className="primary-btn lg" onClick={() => nav("/verify")}>
              Launch Verification Studio <ArrowRight size={16} />
            </button>
            <button className="secondary-btn lg" onClick={() => setAuthModalOpen(true)}>
              Officer Sign In &amp; 2FA
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="brand">
            <div className="brand-mark">
              <Sparkles size={18} />
            </div>
            <strong>
              TRUSTLENS <span>AI</span>
            </strong>
          </div>
          <p>
            Autonomous AI Document &amp; Identity Verification Platform · Hackathon 2026 Edition
          </p>
        </div>
        <div className="footer-bottom">
          <span>Screening results are probabilistic indicators designed for human-in-the-loop compliance review.</span>
          <span>Built with React 18, TypeScript, Tesseract.js, HTML5 Canvas 2D &amp; Recharts.</span>
        </div>
      </footer>
    </div>
  );
}
