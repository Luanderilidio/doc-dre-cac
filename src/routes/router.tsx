import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Contatos from "../pages/Contatos";
import BuscaAtiva from "../pages/BuscaAtiva";
import MediacaoEscolar from "../pages/MediacaoEscolar";


const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/admin`} element={<Admin />} />
        <Route path={`/mediacao-escolar`} element={<MediacaoEscolar />} />
        <Route path={`/busca-ativa`} element={<BuscaAtiva />} />
        <Route path={`/contatos`} element={<Contatos />} />
          <Route path="*" element={<>No Match</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
