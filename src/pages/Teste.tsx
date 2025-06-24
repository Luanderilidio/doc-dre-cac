// src/pages/Dashboard.tsx
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Teste() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Bem-vindo, {user?.name}</h1>
      <img src={user?.picture} alt="profile" />
      <p>Email: {user?.email}</p>
      <button
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        Sair
      </button>
    </div>
  );
}
