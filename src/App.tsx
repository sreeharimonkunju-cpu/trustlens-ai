import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, FileCheck2, FileSearch, Fingerprint, History as HistoryIcon, LockKeyhole, ScanFace, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { analyzeDocument } from "./services/mockAI";
import { demoOptions } from "./data/demo";
import { RiskBadge, MetricCard, ProgressMetric, SectionTitle, SignalIcon, TrustGauge } from "./components/UI";
import { UploadDropzone } from "./components/UploadDropzone";
import { Scanner } from "./components/Scanner";
import type { DemoCase } from "./types";

function AppShell() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";
  if (isLanding) return <Routes><Route path="/" element={<Landing/>}/></Routes>;
  return <div className="app-shell"><Sidebar open={menu} onClose={() => setMenu(false)}/><main className="main"><TopBar onMenu={() => setMenu(true)}/><div className="page"><Routes>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/verify" element={<Verify/>}/>
    <Route path="/analysis" element={<Analysis/>}/>
    <Route path="/result" element={<Result/>}/>
    <Route path="/reports" element={<Reports/>}/>
    <Route path="/history" element={<History/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
  </Routes></div></main></div>;
}

function Landing() {
  const nav = useNavigate();
  return <div className="landing">
    <div className="landing-nav"><div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><strong>TRUSTLENS <span>AI</span></strong></div><button className="ghost-btn" onClick={() => nav("/dashboard")}>Open Dashboard <ArrowRight size={16}/></button></div>
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">AI IDENTITY SCREENING PLATFORM</span>
        <h1>See beyond<br/><span>the document.</span></h1>
        <p>AI-powered identity and document screening with explainable risk assessment. Detect suspicious signals, compare identity evidence, and turn complex analysis into a clear Trust Score.</p>
        <div className="hero-actions"><button className="primary-btn" onClick={() => nav("/verify")}>Start Verification <ArrowRight size={17}/></button><button className="secondary-btn" onClick={() => nav("/verify?demo=1")}>Try Demo</button></div>
        <div className="trust-note"><LockKeyhole size={14}/> Synthetic/demo data only · Human review recommended for ambiguous cases</div>
      </div>
      <div className="hero-orbit">
        <div className="orbit orbit1"/><div className="orbit orbit2"/><div className="orbit orbit3"/>
        <motion.div className="hero-document" animate={{ y: [0,-10,0], rotate: [-2,2,-2] }} transition={{ duration: 5, repeat: Infinity }}>
          <div className="doc-top"><span>DEMO ID</span><span>AI SCREEN</span></div><div className="doc-photo"/><div className="doc-lines"><i/><i/><i/><i/></div><div className="doc-chip"><Fingerprint size={28}/></div><div className="doc-scan"/>
        </motion.div>
        <div className="float-card fc1"><ScanFace size={18}/><div><b>Face Match</b><strong>96%</strong></div></div>
        <div className="float-card fc2"><FileCheck2 size={18}/><div><b>OCR Confidence</b><strong>95%</strong></div></div>
        <div className="float-score"><span>TRUST SCORE</span><b>92</b><em>LOW RISK</em></div>
      </div>
    </section>
    <section className="feature-strip">{[
      ["AI Document Analysis","OCR + forensic screening",FileSearch],["Face Verification","Similarity signals",ScanFace],["Identity Consistency","Cross-field checks",Fingerprint],["Explainable Scoring","Understand every signal",BarChart3]
    ].map(([a,b,I]) => <div className="feature-tile" key={a as string}><div className="feature-icon"><I size={19}/></div><div><b>{a as string}</b><span>{b as string}</span></div></div>)}</section>
    <section className="how"><div><span className="eyebrow">HOW IT WORKS</span><h2>Upload → Analyze → Verify → Score → Explain</h2></div><div className="how-grid">{["Upload","Analyze","Verify","Score","Explain"].map((x,i)=><div className="how-step" key={x}><span>0{i+1}</span><b>{x}</b><p>{["Provide demo evidence","Run AI screening","Compare identity signals","Calculate Trust Score","Understand the result"][i]}</p></div>)}</div></section>
    <footer>TrustLens AI · Built as a hackathon prototype · Screening results are probabilistic indicators and should not replace qualified human verification.</footer>
  </div>;
}

function Dashboard() {
  const nav = useNavigate(); const { history, result } = useApp();
  const shown = history.length ? history : [];
  return <Page title="Identity Verification Dashboard" eyebrow="GOOD AFTERNOON">
    <div className="page-heading-actions"><button className="primary-btn" onClick={() => nav("/verify")}><ShieldCheck size={16}/> New Verification</button></div>
    <div className="metrics-grid">
      <MetricCard label="Total Verifications" value={1284 + history.length} delta="+12.4% this month" icon={FileCheck2}/>
      <MetricCard label="Low Risk" value={892} delta="+8.1%" icon={CheckCircle2}/>
      <MetricCard label="Needs Review" value={274} delta="+4.3%" icon={AlertTriangle}/>
      <MetricCard label="High Risk" value={118} delta="+2.1%" icon={ShieldCheck}/>
    </div>
    <div className="dashboard-grid">
      <div className="card score-card"><div><span className="eyebrow">LATEST TRUST SCORE</span><h2>{result?.score ?? 87} <small>/ 100</small></h2><RiskBadge risk={result?.risk ?? "LOW RISK"}/><p>{result ? "Latest demo screening result." : "Sample dashboard metrics. Run a demo verification to replace these with live session data."}</p></div><TrustGauge score={result?.score ?? 87} size={180}/></div>
      <div className="card signal-card"><SectionTitle icon={Sparkles} title="Screening Signals" subtitle="Weighted inputs to the Trust Score"/><ProgressMetric label="Document Authenticity" value={result?.signals.document ?? 92}/><ProgressMetric label="Face Match" value={result?.signals.face ?? 96}/><ProgressMetric label="Identity Consistency" value={result?.signals.identity ?? 100}/><ProgressMetric label="Document Quality" value={result?.signals.quality ?? 90}/><ProgressMetric label="OCR Confidence" value={result?.signals.ocr ?? 95}/></div>
    </div>
    <div className="card table-card"><div className="table-head"><div><span className="eyebrow">RECENT VERIFICATIONS</span><h2>Screening activity</h2></div><button className="ghost-btn" onClick={() => nav("/history")}>View All <ArrowRight size={15}/></button></div><VerificationTable rows={shown.slice(0,5)} fallback/></div>
  </Page>;
}

function VerificationTable({ rows, fallback=false }: { rows: any[]; fallback?: boolean }) {
  const nav = useNavigate();
  const sample = [
    {id:"TL-2026-001284",name:"Arun Kumar",doc:"Demo ID",score:92,risk:"LOW RISK",date:"Today"},
    {id:"TL-2026-001283",name:"Rahul Kumar",doc:"Demo ID",score:41,risk:"HIGH RISK",date:"Today"},
    {id:"TL-2026-001277",name:"Priya Sharma",doc:"Passport Demo",score:78,risk:"REVIEW",date:"Yesterday"},
  ];
  const data = rows.length ? rows.map(r=>({id:r.id,name:r.identity.name,doc:r.documentType,score:r.score,risk:r.risk,date:new Date(r.createdAt).toLocaleDateString()})) : fallback ? sample : [];
  return <div className="table-scroll"><table><thead><tr><th>Applicant</th><th>Document</th><th>Trust Score</th><th>Risk</th><th>Date</th><th>Status</th><th/></tr></thead><tbody>{data.map((r:any)=><tr key={r.id}><td><b>{r.name}</b><small>{r.id}</small></td><td>{r.doc}</td><td><strong>{r.score}</strong></td><td><RiskBadge risk={r.risk}/></td><td>{r.date}</td><td><span className="status-text">{r.risk==="LOW RISK"?"Verified":"Review"}</span></td><td><button className="text-btn" onClick={()=>nav("/result")}>View Report</button></td></tr>)}</tbody></table></div>;
}

function Verify() {
  const nav = useNavigate(); const { setResult, addHistory } = useApp();
  const [doc, setDoc] = useState<File|null>(null); const [selfie,setSelfie]=useState<File|null>(null);
  const [type,setType]=useState("Auto Detect"); const [caseId,setCaseId]=useState<DemoCase>("genuine");
  const [running,setRunning]=useState(false); const [step,setStep]=useState(0); const [error,setError]=useState("");
  const start = async (selectedCase=caseId) => {
    setError(""); setRunning(true); setStep(0);
    for(let i=1;i<=10;i++){ await new Promise(r=>setTimeout(r,450)); setStep(i); }
    try { const r=await analyzeDocument(doc ?? undefined, selectedCase); setResult(r); addHistory(r); setRunning(false); nav("/result"); } catch { setRunning(false); setError("Screening could not be completed. Please try again."); }
  };
  const chooseDemo=(c:DemoCase)=>{setCaseId(c); setDoc(null); setSelfie(c==="no-selfie"?null:new File(["demo"], "demo-selfie.jpg",{type:"image/jpeg"}));};
  return <Page title="Verify Identity" eyebrow="SCREENING WORKFLOW" subtitle="Upload a synthetic/demo identity document and optional selfie for AI screening.">
    {running ? <Scanner current={step}/> : <>
      <div className="privacy"><LockKeyhole size={17}/><div><b>Privacy notice</b><span>Demo documents are processed for screening demonstration only. Do not upload real sensitive identity documents.</span></div></div>
      <div className="verify-grid">
        <div className="card upload-card"><SectionTitle icon={UploadCloud} title="Identity Evidence" subtitle="Provide the document and optional selfie."/><UploadDropzone label="IDENTITY DOCUMENT" file={doc} onFile={setDoc} onRemove={()=>setDoc(null)}/><UploadDropzone label="SELFIE · OPTIONAL" file={selfie} onFile={setSelfie} onRemove={()=>setSelfie(null)} accept="image/png,image/jpeg"/><div className="field"><label>Document type</label><select value={type} onChange={e=>setType(e.target.value)}>{["Auto Detect","ID Card","Passport","Driving Licence","PAN-like Demo ID","Aadhaar-like Demo ID"].map(x=><option key={x}>{x}</option>)}</select></div>
          {error && <div className="error-box"><AlertTriangle size={16}/>{error}</div>}
          <button className="primary-btn wide" onClick={()=>start()} disabled={!doc && !caseId}>Start Verification <ArrowRight size={16}/></button>
        </div>
        <div className="card demo-card"><SectionTitle icon={Sparkles} title="Try Demo" subtitle="Deterministic cases designed for your hackathon presentation."/><div className="demo-list">{demoOptions.map(o=><button key={o.id} className={`demo-option ${caseId===o.id?"selected":""}`} onClick={()=>chooseDemo(o.id)}><div><b>{o.label}</b><span>{o.description}</span></div><ArrowRight size={16}/></button>)}</div><div className="demo-hint"><strong>Recommended judge flow</strong><span>Try Demo → Altered Document → Start Verification → Why? → Report</span></div></div>
      </div>
    </>}
  </Page>;
}

function Analysis() {
  const { result } = useApp(); if(!result) return <Empty title="No analysis yet" text="Run a verification first to populate document analysis."/>; 
  return <Page title="Document Analysis" eyebrow="SCREENING EVIDENCE"><div className="analysis-grid">
    <div className="card document-card"><SectionTitle icon={FileSearch} title="Visual Analysis" subtitle="Demo document preview and screening overlay"/><div className="fake-document"><div className="scan-overlay"/><div className="box box-photo">PHOTO</div><div className="box box-name">NAME</div><div className="box box-dob">DOB</div><div className="box box-number">DOC NUMBER</div><div className="fake-photo"/><div className="fake-text"><i/><i/><i/><i/><i/><i/></div><div className="fake-chip"/></div><div className="overlay-toggle">● Analysis Overlay Enabled <span>Why?</span></div></div>
    <div className="card"><SectionTitle icon={FileCheck2} title="OCR Results" subtitle="Masked synthetic identity fields"/><div className="identity-list">{Object.entries(result.identity).map(([k,v])=><div key={k}><span>{k.replace(/([A-Z])/g," $1")}</span><b>{v}</b></div>)}</div><div className="confidence"><span>OCR Confidence</span><b>{result.signals.ocr}%</b></div></div>
    <div className="card"><SectionTitle icon={AlertTriangle} title="Document Forensics" subtitle="Indicators, not proof of fraud"/><div className="forensic-score"><div><span>Forgery Indicator</span><strong>{result.forensics.manipulation}%</strong></div><em className={`level level-${result.forensics.level.toLowerCase()}`}>{result.forensics.level}</em></div>{["Document structure detected","Required fields detected","OCR successful","Document dimensions consistent","Text positioning analyzed"].map(x=><div className="check-row" key={x}><CheckCircle2 size={16}/>{x}</div>)}{result.forensics.indicators.map(x=><div className="warn-row" key={x}><AlertTriangle size={16}/>{x}</div>)}</div>
  </div></Page>;
}

function Result() {
  const { result } = useApp(); const nav=useNavigate(); const [why,setWhy]=useState(false);
  if(!result) return <Empty title="No result available" text="Start a verification to see the TrustLens result." action={()=>nav("/verify")}/>;
  const contributions = [
    ["Document Forensics", Math.round(result.signals.document*.3) - 30],
    ["Face Match", result.signals.face===null ? 0 : Math.round(result.signals.face*.25)],
    ["Identity Consistency", Math.round(result.signals.identity*.2)],
    ["Document Quality", Math.round(result.signals.quality*.15)],
    ["OCR", Math.round(result.signals.ocr*.1)]
  ];
  return <Page title="Verification Result" eyebrow="FINAL SCREENING ASSESSMENT"><div className="result-hero card"><div className="result-score"><TrustGauge score={result.score} size={230}/><RiskBadge risk={result.risk}/><span className="result-disclaimer">AI SCREENING / RISK ASSESSMENT</span></div><div className="result-summary"><span className="eyebrow">AI SCREENING SUMMARY</span><h2>{result.risk === "LOW RISK" ? "Low-risk screening signals detected." : result.risk === "REVIEW" ? "Some signals require human review." : "High-risk screening signals detected."}</h2><p>Trust Score is a weighted assessment of available signals. It does not establish identity or document authenticity.</p><div className="result-metrics"><ProgressMetric label="Document Authenticity / Forensics" value={result.signals.document}/><ProgressMetric label="Face Match" value={result.signals.face}/><ProgressMetric label="Identity Consistency" value={result.signals.identity}/><ProgressMetric label="Document Quality" value={result.signals.quality}/><ProgressMetric label="OCR Confidence" value={result.signals.ocr}/></div></div></div>
    <div className="result-actions"><button className="primary-btn" onClick={()=>setWhy(true)}><Sparkles size={16}/> View Why?</button><button className="secondary-btn" onClick={()=>window.print()}>Export Report</button><button className="ghost-btn" onClick={()=>nav("/verify")}>Start New Verification</button></div>
    <div className="result-grid"><div className="card"><SectionTitle icon={ShieldCheck} title="Positive Indicators"/>{result.positives.map(x=><div className="indicator positive" key={x}><SignalIcon type="positive"/><span>{x}</span></div>)}</div><div className="card"><SectionTitle icon={AlertTriangle} title="Risk Indicators"/>{result.risks.length?result.risks.map(x=><div className="indicator risk" key={x.title}><SignalIcon type="risk"/><div><b>{x.title}</b><span>{x.severity} · {x.contribution > 0 ? "+" : ""}{x.contribution} score contribution</span></div></div>):<div className="empty-inline">No significant demo risk indicators.</div>}</div><div className="card"><SectionTitle icon={Fingerprint} title="Identity Consistency"/>{result.consistency.map(x=><div className={`consistency ${x.status}`} key={x.label}><span>{x.status==="match"?<CheckCircle2 size={15}/>:<AlertTriangle size={15}/>} {x.label}</span><b>{x.status==="match"?"Match":"Mismatch"}</b>{x.detail&&<small>{x.detail}</small>}</div>)}</div></div>
    {why && <div className="modal-backdrop" onClick={()=>setWhy(false)}><div className="why-panel" onClick={e=>e.stopPropagation()}><div className="panel-head"><div><span className="eyebrow">EXPLAINABLE AI</span><h2>Why did TrustLens give this result?</h2></div><button className="icon-btn" onClick={()=>setWhy(false)}>×</button></div><div className="why-section"><h3>Positive signals</h3>{result.positives.map(x=><div className="why-row positive" key={x}><CheckCircle2 size={16}/>{x}</div>)}</div><div className="why-section"><h3>Risk signals</h3>{result.risks.length?result.risks.map(x=><div className="why-row risk" key={x.title}><AlertTriangle size={16}/><div><b>{x.title}</b><span>{x.explanation}</span></div></div>):<div className="why-row">No major negative signals in this demo.</div>}</div><div className="why-section"><h3>Score contributions</h3>{contributions.map(([a,b])=><div className="contribution" key={a as string}><span>{a as string}</span><b>{(b as number)>=0?"+":""}{b as number}</b></div>)}</div><div className="panel-foot">Human review is recommended for high-risk or ambiguous cases.</div></div></div>}
  </Page>;
}

function Reports() {
  const { history }=useApp(); const riskData=[{name:"Low Risk",value:69.5},{name:"Review",value:21.3},{name:"High Risk",value:9.2}]; const volume=[{d:"Mon",v:132},{d:"Tue",v:168},{d:"Wed",v:145},{d:"Thu",v:194},{d:"Fri",v:177},{d:"Sat",v:121},{d:"Sun",v:147}];
  return <Page title="Risk Reports" eyebrow="ANALYTICS"><div className="metrics-grid"><MetricCard label="Total Screened" value={1284+history.length} icon={FileCheck2}/><MetricCard label="Average Trust Score" value="81.4" icon={BarChart3}/><MetricCard label="High Risk" value="9.2%" icon={AlertTriangle}/><MetricCard label="Review Required" value="21.3%" icon={ShieldCheck}/></div><div className="charts-grid"><div className="card chart-card"><SectionTitle icon={BarChart3} title="Verification Volume" subtitle="Illustrative weekly activity"/><ResponsiveContainer width="100%" height={260}><BarChart data={volume}><XAxis dataKey="d"/><YAxis/><Tooltip/><Bar dataKey="v" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div><div className="card chart-card"><SectionTitle icon={ShieldCheck} title="Risk Distribution" subtitle="Current screening mix"/><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={65} outerRadius={95} paddingAngle={3}>{riskData.map((_,i)=><Cell key={i}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><div className="card chart-card full"><SectionTitle icon={BarChart3} title="Average Trust Score Trend" subtitle="Illustrative trend for the dashboard demo"/><ResponsiveContainer width="100%" height={260}><LineChart data={volume.map((x,i)=>({d:x.d,v:[79,80,82,81,84,83,85][i]}))}><XAxis dataKey="d"/><YAxis domain={[70,100]}/><Tooltip/><Line type="monotone" dataKey="v" strokeWidth={3}/></LineChart></ResponsiveContainer></div></div></Page>;
}

function History() {
  const {history}=useApp(); const [q,setQ]=useState(""); const filtered=history.filter(x=>`${x.id} ${x.identity.name} ${x.documentType}`.toLowerCase().includes(q.toLowerCase()));
  return <Page title="Verification History" eyebrow="SESSION RECORDS" subtitle="Only mock result metadata is persisted in localStorage for this prototype."><div className="card table-card"><div className="filter-row"><input placeholder="Search applicant, report ID or document type…" value={q} onChange={e=>setQ(e.target.value)}/><div className="filter-pills"><span>All</span><span>Low Risk</span><span>Review</span><span>High Risk</span></div></div><VerificationTable rows={filtered}/>{!history.length&&<div className="empty-state"><HistoryIcon size={30}/><h3>No session verifications yet</h3><p>Run one of the deterministic demo cases to populate history.</p></div>}</div></Page>;
}

function Settings() {
  const {settings,updateSettings}=useApp();
  return <Page title="Settings" eyebrow="SYSTEM CONFIGURATION"><div className="settings-grid"><div className="card settings-card"><SectionTitle icon={Sparkles} title="Appearance & Notifications"/><div className="setting-row"><div><b>Theme</b><span>Switch between dark and light workspace.</span></div><div className="segmented"><button className={settings.theme==="dark"?"on":""} onClick={()=>updateSettings({theme:"dark"})}>Dark</button><button className={settings.theme==="light"?"on":""} onClick={()=>updateSettings({theme:"light"})}>Light</button></div></div><div className="setting-row"><div><b>Notifications</b><span>Show screening activity notifications.</span></div><button className={`toggle ${settings.notifications?"on":""}`} onClick={()=>updateSettings({notifications:!settings.notifications})}><i/></button></div></div><div className="card settings-card"><SectionTitle icon={ShieldCheck} title="Risk Thresholds" subtitle="Configurable scoring boundaries."/><div className="range-setting"><div><span>Low Risk</span><b>{settings.lowRisk}</b></div><input type="range" min="70" max="95" value={settings.lowRisk} onChange={e=>updateSettings({lowRisk:+e.target.value})}/></div><div className="range-setting"><div><span>Review threshold</span><b>{settings.review}</b></div><input type="range" min="30" max="69" value={settings.review} onChange={e=>updateSettings({review:+e.target.value})}/></div><div className="threshold-preview"><span>LOW RISK</span><b>{settings.lowRisk}–100</b><span>REVIEW</span><b>{settings.review}–{settings.lowRisk-1}</b><span>HIGH RISK</span><b>0–{settings.review-1}</b></div></div><div className="card settings-card"><SectionTitle icon={CpuIcon} title="AI Engine Status"/><div className="engine-row"><span>OCR Engine</span><b>Connected</b></div><div className="engine-row"><span>Document Analysis</span><b>Ready</b></div><div className="engine-row"><span>Face Verification</span><b>Ready</b></div><div className="engine-row"><span>Mode</span><b>Deterministic Mock AI</b></div></div></div></Page>;
}
function CpuIcon(){return <Sparkles size={18}/>}

function Page({title,eyebrow,subtitle,children}:{title:string;eyebrow:string;subtitle?:string;children:React.ReactNode}) {
  return <div className="content"><div className="page-title"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div></div>{children}</div>;
}
function Empty({title,text,action}:{title:string;text:string;action?:()=>void}) { return <Page title={title} eyebrow="TRUSTLENS AI"><div className="card empty-state"><FileSearch size={34}/><p>{text}</p>{action&&<button className="primary-btn" onClick={action}>Start Verification</button>}</div></Page> }

export default function App(){return <AppProvider><AppShell/></AppProvider>}


