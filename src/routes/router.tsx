import { BrowserRouter, Routes, Route } from "react-router-dom";
import Arquivo from "../pages/Arquivo";
import Home from "../pages/Home";
import Solicitacao from "../pages/Solicitacao";
import Gremios from "../pages/Gremios";
import Mural from "../pages/Mural"; 
import Teste from "../pages/Teste";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import { AuthProvider } from "../auth/AuthProvider";
import GremioAdmin from "../pages/GremioAdmin";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/arquivo`} element={<Arquivo />} />
            <Route path={`/mural`} element={<Mural />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/teste`} element={
              <ProtectedRoute>

                <Teste />
              </ProtectedRoute>
            } />
            <Route path={`/gremio-estudantil/admin`}
              element={
                <GremioAdmin />
              }
            />
            <Route path={`/gremio-estudantil`} element={<Gremios />} />
            <Route path={`/solicitacao/:id`} element={<Solicitacao />} />
            <Route path="*" element={<>No Match</>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
