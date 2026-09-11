import { Bell, CheckCircle2, LogOut, Menu, Shield, UserCheck, Check, AlertTriangle, Info } from "lucide-react";
import { useApp } from "../context";
import { useState } from "react";

export function TopBar({ onMenu }: { onMenu: () => void }) {
  const { settings, currentUser, setAuthModalOpen, logoutUser, notifications, unreadNotifications, markNotificationsRead } = useApp();
  const [dropdown, setDropdown] = useState<false | "profile" | "notifications">(false);

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} title="Toggle menu">
        <Menu size={20} />
      </button>

      <div className="crumb">
        <Shield size={16} />
        <span>Secure Identity Screening Workspace</span>
        <span className="crumb-chip">Neural v2.4</span>
      </div>

      <div className="top-actions">
        {currentUser ? (
          <div className="user-profile-menu">
            <button
              className="user-btn"
              onClick={() => setDropdown(dropdown === "profile" ? false : "profile")}
              title="View account"
            >
              <div className="avatar">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div className="user-meta-top">
                <b>{currentUser.name}</b>
                <span>
                  <CheckCircle2 size={11} className="verified-icon" /> {currentUser.role}
                </span>
              </div>
            </button>

            {dropdown && (
              <div className="profile-dropdown" onClick={() => setDropdown(false)}>
                <div className="dropdown-head">
                  <strong>{currentUser.name}</strong>
                  <span>{currentUser.email}</span>
                  <div className="role-tag">{currentUser.role}</div>
                </div>
                <div className="dropdown-item">
                  <Shield size={14} /> 2FA Secured Session
                </div>
                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    logoutUser();
                    setDropdown(false);
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="primary-btn sm" onClick={() => setAuthModalOpen(true)}>
            <UserCheck size={14} /> Officer Sign In
          </button>
        )}

        <div className="notification-wrap">
          <button
            className={`notification ${settings.notifications ? "" : "muted"}`}
            title={settings.notifications ? "System notifications" : "Notifications disabled"}
            onClick={() =>
  settings.notifications &&
  setDropdown(dropdown === "notifications" ? false : "notifications")
}
          >
            <Bell size={18} />
            {unreadNotifications > 0 && <span className="notification-count">{unreadNotifications > 9 ? "9+" : unreadNotifications}</span>}
          </button>
          {dropdown === "notifications" && (
            <div className="notification-panel">
              <div className="notification-panel-head">
                <div><b>Notifications</b><small>{unreadNotifications} unread</small></div>
                {unreadNotifications > 0 && <button className="text-btn" onClick={markNotificationsRead}><Check size={13}/> Mark all read</button>}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? <div className="notification-empty"><Bell size={20}/><span>No notifications yet</span></div> :
                  notifications.slice(0, 6).map(n => (
                    <div className={`notification-item ${n.read ? "read" : ""}`} key={n.id}>
                      <div className={`notification-kind ${n.kind}`}><span>{n.kind === "success" ? "✓" : n.kind === "warning" ? "!" : "i"}</span></div>
                      <div><b>{n.title}</b><p>{n.message}</p><small>{new Date(n.createdAt).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</small></div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}