import { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

const input: React.CSSProperties = {
  width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14,
  border: "1px solid #d1d5db", background: "#f9fafb", color: "#111827",
  outline: "none", boxSizing: "border-box",
};
const btn: React.CSSProperties = {
  width: "100%", padding: "11px", borderRadius: 8, fontSize: 14, fontWeight: 600,
  border: "none", cursor: "pointer", background: "#2563eb", color: "#fff",
};

interface Props { onSwitch: () => void; }

export function LoginForm({ onSwitch }: Props) {
  const { login } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Sign in</h2>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280" }}>Welcome back. Enter your credentials to continue.</p>

      {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fca5a5", fontSize: 13, color: "#b91c1c" }}>{error}</div>}

      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Email</label>
        <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Password</label>
        <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
      </div>

      <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: 0 }}>
        No account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
          Create one
        </button>
      </p>
    </form>
  );
}
