import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Dashboard } from "./components/Dashboard";

export function App() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Loading...</div>
      </div>
    );
  }

  if (user) return <Dashboard />;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, padding: "40px 36px", border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        {showRegister
          ? <RegisterForm onSwitch={() => setShowRegister(false)} />
          : <LoginForm    onSwitch={() => setShowRegister(true)}  />
        }
      </div>
    </div>
  );
}
