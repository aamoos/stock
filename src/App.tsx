import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useTheme } from './hooks/useTheme';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const GuideIndexPage = lazy(() => import('./pages/GuideIndexPage').then(m => ({ default: m.GuideIndexPage })));
const GuideArticlePage = lazy(() => import('./pages/GuideArticlePage').then(m => ({ default: m.GuideArticlePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));

function AppRoutes() {
  useTheme();
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/guide" element={<GuideIndexPage />} />
          <Route path="/guide/:slug" element={<GuideArticlePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
