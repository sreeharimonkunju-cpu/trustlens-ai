import { Bell, Menu, Shield } from "lucide-react";
import { useApp } from "../context";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { settings } = useApp();
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu}><Menu size={20}/></button>
      <div className="crumb"><Shield size={16}/> Secure screening workspace</div>
      <div className="top-actions">
        <span className="demo-badge">DEMO / SIMULATION</span>
        <div className={`notification ${settings.notifications ? "" : "muted"}`}><Bell size={18}/><span/></div>
        <div className="avatar">TL</div>
      </div>
    </header>
  );
}