import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";
import Home from "../pages/Home";


const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path={`/`} element={<Home />} />
        <Route path={`/admin`} element={<Admin />} />
          <Route path="*" element={<>No Match</>} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
