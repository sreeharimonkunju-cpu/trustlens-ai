import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, CircleHelp, FileCheck2, ScanFace, ShieldAlert } from "lucide-react";
import type { RiskLevel } from "../types";

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cls = risk === "LOW RISK" ? "risk-low" : risk === "REVIEW" ? "risk-review" : "risk-high";
  return <span className={`risk-badge ${cls}`}>{risk === "LOW RISK" ? <CheckCircle2 size={14}/> : <AlertTriangle size={14}/>} {risk}</span>;
}

export function MetricCard({ label, value, delta, icon: Icon }: { label: string; value: string | number; delta?: string; icon: React.ElementType }) {
  return <motion.div className="metric-card card" whileHover={{ y: -3 }}>
    <div className="metric-icon"><Icon size={18}/></div>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}</div>
    {delta && <div className="metric-delta">{delta}</div>}
  </motion.div>;
}

export function TrustGauge({ score, size = 220 }: { score: number; size?: number }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const riskClass = score >= 80 ? "gauge-good" : score >= 50 ? "gauge-warn" : "gauge-bad";
  return <div className={`gauge ${riskClass}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={radius} className="gauge-track"/>
      <motion.circle cx="50" cy="50" r={radius} className="gauge-value"
        strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: "easeOut" }} transform="rotate(-90 50 50)"/>
    </svg>
    <div className="gauge-center"><strong>{score}</strong><span>/ 100</span></div>
  </div>;
}

export function ProgressMetric({ label, value }: { label: string; value: number | null }) {
  if (value === null) return <div className="progress-row"><div><span>{label}</span><b>Unavailable</b></div><div className="progress-track"><div className="progress-fill unavailable"/></div></div>;
  return <div className="progress-row"><div><span>{label}</span><b>{value}%</b></div><div className="progress-track"><motion.div className="progress-fill" initial={{width:0}} animate={{width:`${value}%`}}/></div></div>;
}

export function SignalIcon({ type }: { type: "positive" | "risk" | "help" }) {
  if (type === "positive") return <CheckCircle2 size={16}/>;
  if (type === "risk") return <ShieldAlert size={16}/>;
  return <CircleHelp size={16}/>;
}

export function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return <div className="section-title"><div className="section-icon"><Icon size={18}/></div><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div></div>;
}