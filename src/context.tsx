import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AnalysisResult } from "./types";

interface Settings {
  theme: "dark" | "light";
  notifications: boolean;
  lowRisk: number;
  review: number;
}
interface AppContextValue {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
  history: AnalysisResult[];
  addHistory: (r: AnalysisResult) => void;
  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<AnalysisResult | null>(() => {
    const raw = localStorage.getItem("trustlens-result");
    return raw ? JSON.parse(raw) : null;
  });
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    const raw = localStorage.getItem("trustlens-history");
    return raw ? JSON.parse(raw) : [];
  });
  const [settings, setSettings] = useState<Settings>(() => {
    const raw = localStorage.getItem("trustlens-settings");
    return raw ? JSON.parse(raw) : { theme: "dark", notifications: true, lowRisk: 80, review: 50 };
  });

  useEffect(() => {
    localStorage.setItem("trustlens-result", JSON.stringify(result));
  }, [result]);
  useEffect(() => {
    localStorage.setItem("trustlens-history", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    localStorage.setItem("trustlens-settings", JSON.stringify(settings));
    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  const value = useMemo(() => ({
    result,
    setResult,
    history,
    addHistory: (r: AnalysisResult) => setHistory((h) => [r, ...h.filter((x) => x.id !== r.id)].slice(0, 50)),
    settings,
    updateSettings: (s: Partial<Settings>) => setSettings((x) => ({ ...x, ...s })),
  }), [result, history, settings]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
  const v = useContext(AppContext);
  if (!v) throw new Error("useApp must be used inside AppProvider");
  return v;
}