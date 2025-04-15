import { BrowserRouter, Routes, Route } from "react-router-dom";
import Arquivo from "../pages/Arquivo";
import Home from "../pages/Home";
import Solicitacao from "../pages/Solicitacao";
import Gremios from "../pages/Gremios";
import Mural from "../pages/Mural";
import GremioAdmin from "../pages/GremioAdmin";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/arquivo`} element={<Arquivo />} />
          <Route path={`/mural`} element={<Mural />} />
          <Route path={`/gremio-estudantil/admin`} element={<GremioAdmin />} />
          <Route path={`/gremio-estudantil`} element={<Gremios />} />
          <Route path={`/solicitacao/:id`} element={<Solicitacao />} />
          <Route path="*" element={<>No Match</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
