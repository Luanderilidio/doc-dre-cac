// src/pages/Home.tsx
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-4 border rounded-2xl flex flex-col gap-5 items-center justify-center">
        <h1 className="text-3xl font-bold">Faça Login na Plataforma</h1>
        <GoogleLogin
          onSuccess={credentialResponse => {
            login(credentialResponse)
            navigate("/gremio-estudantil/admin")
          }
          }
          onError={() => console.log("Login Failed")}
          useOneTap={false}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          width="100%" // para o widget padrão tentar expandir
        // render personalizado:
        // render={renderProps => (
        //   <button
        //     onClick={renderProps.onClick}
        //     disabled={renderProps.disabled}
        //     className="w-full bg-white text-black border border-gray-300 rounded px-4 py-2 shadow hover:bg-gray-100 transition"
        //   >
        //     Entrar com Google
        //   </button>
        // )}
        />
      </div>
    </div>
  );
}
