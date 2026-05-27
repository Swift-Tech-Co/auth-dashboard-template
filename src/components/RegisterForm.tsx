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

export function RegisterForm({ onSwitch }: Props) {
  const { register } = useAuth();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: "#111827" }}>Create account</h2>
      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6b7280" }}>Get started in seconds. No credit card required.</p>

      {error && <div style={{ padding: "10px 14px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fca5a5", fontSize: 13, color: "#b91c1c" }}>{error}</div>}

      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Full name</label>
        <input style={input} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Smith" />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Email</label>
        <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 }}>Password</label>
        <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" placeholder="Min 8 characters" />
      </div>

      <button style={{ ...btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", margin: 0 }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
          Sign in
        </button>
      </p>
    </form>
  );
}
