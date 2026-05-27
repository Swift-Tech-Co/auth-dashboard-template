import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User { id: string; email: string; name: string; }

interface AuthCtx {
  user:     User | null;
  token:    string | null;
  loading:  boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout:   () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

const API = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiFetch("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((d) => setUser(d.user))
      .catch(() => { localStorage.removeItem("token"); setToken(null); })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await apiFetch("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
