import { motion } from "framer-motion";
import { Check, Cpu, ScanLine } from "lucide-react";

const steps = ["Document uploaded","Document type identified","Image quality analyzed","OCR completed","Identity fields extracted","Face detected","Face comparison completed","Document forensics completed","Identity consistency checked","Risk score calculated"];

export function Scanner({ current }: { current: number }) {
  return <div className="scanner-card card">
    <div className="scanner-visual"><div className="scan-grid"/><motion.div className="scan-line" animate={{ y: ["0%", "100%", "0%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}/><div className="scanner-core"><Cpu size={34}/><span>AI ENGINE</span></div></div>
    <div className="scanner-copy"><span className="eyebrow">AI VERIFICATION IN PROGRESS</span><h2>Analyzing screening signals</h2><p>TrustLens is running a deterministic demo pipeline. Results are screening indicators, not definitive authenticity decisions.</p></div>
    <div className="timeline">{steps.map((step, i) => <div key={step} className={`timeline-step ${i < current ? "done" : i === current ? "current" : ""}`}><div className="timeline-dot">{i < current ? <Check size={13}/> : <ScanLine size={13}/>}</div><span>{step}</span></div>)}</div>
  </div>;
}