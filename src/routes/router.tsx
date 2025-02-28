import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import Home from "../pages/Home";
import Contatos from "../pages/Contatos";
import Solicitacao from "../pages/Solicitacao";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/arquivo`} element={<Admin />} />
          <Route path={`/solicitacao/:id`} element={<Solicitacao />} />

          <Route path={`/contatos`} element={<Contatos />} />
          <Route path="*" element={<>No Match</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
