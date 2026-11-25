import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { LanguageProvider } from "./i18n/LanguageContext.tsx";
import LoadingScreen from "./app/components/LoadingScreen.tsx";
import { ChatWidget } from "./app/components/chat";
import App from "./app/App.tsx";
import NossaHistoria from "./app/pages/NossaHistoria.tsx";
import Produtos from "./app/pages/Produtos.tsx";
import Qualidade from "./app/pages/Qualidade.tsx";
import TrabalheConosco from "./app/pages/TrabalheConosco.tsx";
import PoliticaDePrivacidade from "./app/pages/legal/PoliticaDePrivacidade.tsx";
import PoliticaDeCookies from "./app/pages/legal/PoliticaDeCookies.tsx";
import TermosDeUso from "./app/pages/legal/TermosDeUso.tsx";
import SeoManager from "./seo/SeoManager.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <BrowserRouter>
      <SeoManager />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/nossa-historia" element={<NossaHistoria />} />
        <Route path="/qualidade" element={<Qualidade />} />
        <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
        <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
      </Routes>
    </BrowserRouter>
    {/* Rendered once at app boot, outside the router, so client-side route
        changes never re-trigger it — only a fresh page load does. */}
    <LoadingScreen />
    {/* Widget de chat — fora do Router e fora do canvas escalado de 1440px
        (position: fixed real, não herda transform). Persiste entre rotas. */}
    <ChatWidget />
  </LanguageProvider>,
);
