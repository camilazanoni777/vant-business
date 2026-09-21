import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import HomePage from './pages/HomePage.jsx';
import RecursosPage from './pages/RecursosPage.jsx';
import AutomatizePage from './pages/AutomatizePage.jsx';
import AdminPublishingPage from './pages/AdminPublishingPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen text-[#f0f0f0] antialiased">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/solucoes" element={<RecursosPage />} />
            <Route path="/diagnostico" element={<AutomatizePage />} />
            <Route path="/conversao" element={<Navigate to="/solucoes" replace />} />
            <Route path="/recursos" element={<Navigate to="/solucoes" replace />} />
            <Route path="/solucoes-digitais" element={<Navigate to="/diagnostico" replace />} />
            <Route path="/automatize" element={<Navigate to="/diagnostico" replace />} />
            <Route path="/admin-vant" element={<AdminPublishingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
