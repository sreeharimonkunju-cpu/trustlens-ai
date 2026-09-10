import { NavLink } from "react-router-dom";
import { BarChart3, FileSearch, History, LayoutDashboard, Settings, ShieldCheck, Sparkles, X } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/verify", label: "Verify Identity", icon: ShieldCheck },
  { to: "/analysis", label: "Document Analysis", icon: FileSearch },
  { to: "/reports", label: "Risk Reports", icon: BarChart3 },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`mobile-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={18} /></div>
          <div><strong>TRUSTLENS</strong><span>AI</span></div>
          <button className="icon-btn mobile-close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="sidebar-label">PLATFORM</div>
        <nav>
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} onClick={onClose}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="system-status"><span className="pulse-dot"/> System Status <b>Online</b></div>
          <div className="system-status"><span className="cyan-dot"/> AI Engine <b>Ready</b></div>
          <div className="prototype-note">DEMO / SIMULATION<br/><span>Use synthetic documents only.</span></div>
        </div>
      </aside>
    </>
  );
}