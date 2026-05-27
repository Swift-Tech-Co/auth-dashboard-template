import { useAuth } from "../context/AuthContext";

const card: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: "24px 28px",
  border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
};

export function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "40px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>Dashboard</h1>
            <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            style={{ padding: "8px 18px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1px solid #d1d5db", background: "#fff", color: "#374151", cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827" }}>Account</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Name",    value: user?.name  ?? "" },
              { label: "Email",   value: user?.email ?? "" },
              { label: "User ID", value: user?.id    ?? "" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", width: 60, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 14, color: "#111827", wordBreak: "break-all" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#111827" }}>Quick start</h2>
          <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Replace the in-memory user store with a real database (PostgreSQL, MongoDB, etc.)",
              "Add email verification via a transactional email provider",
              "Wire up password reset with time-limited tokens",
              "Extend AuthContext with role-based access control",
              "Add refresh token rotation for long-lived sessions",
            ].map((tip) => (
              <li key={tip} style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{tip}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
