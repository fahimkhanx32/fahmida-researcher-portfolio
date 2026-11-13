import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import PortfolioPage from './pages/PortfolioPage.jsx';
const LegacyShopHome = lazy(() => import('./pages/LegacyShopHome.jsx'));
const Login = lazy(() => import('./components/Login/Login.jsx'));
const Registration = lazy(() => import('./components/Registration/Registration.jsx'));


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
      <Routes>

        {/* Researcher portfolio (main site) */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Previous e-commerce home, preserved unchanged */}
        <Route path="/legacy-shop" element={<LegacyShopHome />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registration */}
        <Route path="/registration" element={<Registration />} />

      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
