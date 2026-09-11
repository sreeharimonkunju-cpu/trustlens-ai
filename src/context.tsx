import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AnalysisResult, User } from "./types";
import { getStoredUser, saveStoredUser } from "./services/auth";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  kind: "success" | "warning" | "info";
  read: boolean;
  createdAt: string;
}

interface Settings {
  theme: "dark" | "light";
  notifications: boolean;
  lowRisk: number;
  review: number;
  apiKey?: string;
}

interface AppContextValue {
  currentUser: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;

  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;

  history: AnalysisResult[];
  addHistory: (r: AnalysisResult) => void;
  clearHistory: () => void;

  settings: Settings;
  updateSettings: (s: Partial<Settings>) => void;

  activeDocFile: File | null;
  setActiveDocFile: (f: File | null) => void;

  activeSelfieFile: File | null;
  setActiveSelfieFile: (f: File | null) => void;

  notifications: NotificationItem[];
  unreadNotifications: number;
  addNotification: (
    title: string,
    message: string,
    kind?: NotificationItem["kind"]
  ) => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStoredUser()
  );

  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [result, setResult] = useState<AnalysisResult | null>(() => {
    try {
      const raw = localStorage.getItem("trustlens-result");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const raw = localStorage.getItem("trustlens-history");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem("trustlens-settings");

      return raw
        ? JSON.parse(raw)
        : {
            theme: "dark",
            notifications: true,
            lowRisk: 80,
            review: 50,
            apiKey: "tl_live_9481adbc8310ff9271a0",
          };
    } catch {
      return {
        theme: "dark",
        notifications: true,
        lowRisk: 80,
        review: 50,
        apiKey: "tl_live_9481adbc8310ff9271a0",
      };
    }
  });

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >(() => {
    try {
      return JSON.parse(
        localStorage.getItem("trustlens-notifications") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [activeDocFile, setActiveDocFile] =
    useState<File | null>(null);

  const [activeSelfieFile, setActiveSelfieFile] =
    useState<File | null>(null);

  /* ---------------- RESULT PERSISTENCE ---------------- */

  useEffect(() => {
    try {
      if (result) {
        localStorage.setItem(
          "trustlens-result",
          JSON.stringify(result)
        );
      } else {
        localStorage.removeItem("trustlens-result");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [result]);

  /* ---------------- HISTORY PERSISTENCE ---------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        "trustlens-history",
        JSON.stringify(history)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [history]);

  /* ---------------- SETTINGS PERSISTENCE ---------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        "trustlens-settings",
        JSON.stringify(settings)
      );
    } catch {
      // Ignore localStorage errors
    }

    document.documentElement.dataset.theme = settings.theme;
  }, [settings]);

  /* ---------------- NOTIFICATION PERSISTENCE ---------------- */

  useEffect(() => {
    try {
      localStorage.setItem(
        "trustlens-notifications",
        JSON.stringify(notifications)
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [notifications]);

  /* ---------------- AUTH ---------------- */

  const loginUser = (user: User) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    saveStoredUser(null);
  };

  /* ---------------- NOTIFICATIONS ---------------- */

  const addNotification = (
    title: string,
    message: string,
    kind: NotificationItem["kind"] = "info"
  ) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const notification: NotificationItem = {
      id,
      title,
      message,
      kind,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) =>
      [notification, ...current].slice(0, 30)
    );
  };

  const markNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  ).length;

  /* ---------------- HISTORY ---------------- */

  const addHistory = (r: AnalysisResult) => {
    setHistory((current) =>
      [r, ...current.filter((item) => item.id !== r.id)].slice(
        0,
        50
      )
    );
  };

  const clearHistory = () => {
    setHistory([]);

    try {
      localStorage.removeItem("trustlens-history");
    } catch {
      // Ignore localStorage errors
    }
  };

  /* ---------------- SETTINGS ---------------- */

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings((current) => ({
      ...current,
      ...updates,
    }));
  };

  /* ---------------- CONTEXT VALUE ---------------- */

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      authModalOpen,
      setAuthModalOpen,
      loginUser,
      logoutUser,

      result,
      setResult,

      history,
      addHistory,
      clearHistory,

      settings,
      updateSettings,

      activeDocFile,
      setActiveDocFile,

      activeSelfieFile,
      setActiveSelfieFile,

      // Notification values
      notifications,
      unreadNotifications,
      addNotification,
      markNotificationsRead,
    }),
    [
      currentUser,
      authModalOpen,
      result,
      history,
      settings,
      activeDocFile,
      activeSelfieFile,
      notifications,
      unreadNotifications,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return value;
}