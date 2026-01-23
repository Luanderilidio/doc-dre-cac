import { BrowserRouter, Routes, Route } from "react-router-dom";
import Arquivo from "../pages/Arquivo";
import Home from "../pages/Home";
import Solicitacao from "../pages/Solicitacao";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/arquivo`} element={<Arquivo />} />
          <Route path={`/solicitacao/:id`} element={<Solicitacao />} />
          <Route path="*" element={<>No Match</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
