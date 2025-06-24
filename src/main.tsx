import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import NavigationBar from './components/NavigationBar';
import App from './App.tsx';
import Home from './pages/Home.tsx';
import TellMeMore from './pages/TellMeMore.tsx';
import TrulyTwin from './pages/TrulyTwin.tsx';
import TrulySpace from './pages/TrulySpace.tsx';
import TrulyOrigin from './pages/TrulyOrigin.tsx';
import TrulyCircles from './pages/TrulyCircles.tsx';
import HeartprintRecord from './pages/HeartprintRecord.tsx';
import RitualsRealms from './pages/RitualsRealms.tsx';
import FloatingLantern from './pages/FloatingLantern.tsx';
import LullabyMode from './pages/LullabyMode.tsx';
import SecretGarden from './pages/SecretGarden.tsx';
import AIMindMap from './pages/AIMindMap.tsx';
import SacredJournal from './pages/SacredJournal.tsx';
import Premium from './pages/Premium.tsx';
import Profile from './pages/Profile.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tell-me-more" element={<TellMeMore />} />
          <Route path="/premium" element={<Premium />} />
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/truly-twin" 
            element={
              <ProtectedRoute>
                <TrulyTwin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/truly-space" 
            element={
              <ProtectedRoute>
                <TrulySpace />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/truly-origin" 
            element={
              <ProtectedRoute>
                <TrulyOrigin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/truly-circles" 
            element={
              <ProtectedRoute>
                <TrulyCircles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/heartprint-record" 
            element={
              <ProtectedRoute>
                <HeartprintRecord />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rituals-realms" 
            element={
              <ProtectedRoute>
                <RitualsRealms />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/floating-lantern" 
            element={
              <ProtectedRoute>
                <FloatingLantern />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lullaby-mode" 
            element={
              <ProtectedRoute>
                <LullabyMode />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/secret-garden" 
            element={
              <ProtectedRoute>
                <SecretGarden />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ai-mind-map" 
            element={
              <ProtectedRoute>
                <AIMindMap />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sacred-journal" 
            element={
              <ProtectedRoute>
                <SacredJournal />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);