import type { User } from "../types";

export const DEMO_USERS: User[] = [
  {
    id: "usr-judge-01", name: "Alex Morgan", email: "judge@hackathon.ai",
    role: "Lead Compliance Auditor", organization: "Global FinTech Hackathon 2026",
    avatarUrl: "", isVerified: true, twoFactorEnabled: true, createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "usr-analyst-02", name: "Priya Sharma", email: "priya.sharma@trustlens.ai",
    role: "Senior KYC Officer", organization: "TrustLens Security Ops",
    avatarUrl: "", isVerified: true, twoFactorEnabled: true, createdAt: "2026-09-05T14:30:00.000Z",
  },
];

export const DEMO_OTP_CODE = "849201";
const SESSION_KEY = "trustlens-user-session";
const USERS_KEY = "trustlens-registered-users";

type StoredAccount = User & { password: string };

function accounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : DEMO_USERS.map(u => ({ ...u, password: u.email === "judge@hackathon.ai" ? "hackathon2026" : "trustlens2026" }));
  } catch { return []; }
}

function saveAccounts(list: StoredAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveStoredUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export async function authenticateCredentials(email: string, pass: string) {
  await new Promise(r => setTimeout(r, 450));
  const cleanEmail = email.trim().toLowerCase();
  const account = accounts().find(u => u.email.toLowerCase() === cleanEmail);
  if (!account || account.password !== pass) throw new Error("Incorrect email or password.");
  const { password: _password, ...user } = account;
  return { user, requires2FA: true, tempSessionId: `sess-${crypto.randomUUID?.() ?? Date.now()}` };
}

export async function registerAccount(name: string, email: string, pass: string, role: User["role"]) {
  await new Promise(r => setTimeout(r, 450));
  const cleanEmail = email.trim().toLowerCase();
  const list = accounts();
  if (list.some(u => u.email.toLowerCase() === cleanEmail)) throw new Error("An account with this email already exists.");
  if (pass.length < 8) throw new Error("Password must contain at least 8 characters.");
  const user: User = {
    id: `usr-${Math.random().toString(36).slice(2,10)}`, name: name.trim(), email: cleanEmail,
    role, organization: "TrustLens Identity Cloud", isVerified: false, twoFactorEnabled: true,
    createdAt: new Date().toISOString(),
  };
  saveAccounts([...list, { ...user, password: pass }]);
  return { user, tempSessionId: `sess-${Date.now()}` };
}

export async function requestPasswordReset(email: string) {
  await new Promise(r => setTimeout(r, 350));
  const exists = accounts().some(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!exists) throw new Error("No TrustLens account was found for this email.");
  return true;
}

export async function verifyTwoFactorCode(_tempSessionId: string, enteredCode: string, pendingUser: User) {
  await new Promise(r => setTimeout(r, 400));
  if (enteredCode.trim() !== DEMO_OTP_CODE) {
    return { success: false, error: `Invalid verification code. Demo code: ${DEMO_OTP_CODE}` };
  }
  const verifiedUser = { ...pendingUser, isVerified: true };
  saveStoredUser(verifiedUser);
  return { success: true, user: verifiedUser };
}

export function quickJudgeLogin(): User {
  const judge = DEMO_USERS[0];
  saveStoredUser(judge);
  return judge;
}
