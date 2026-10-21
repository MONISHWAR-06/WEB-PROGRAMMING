import React from 'react';
// HashRouter is required for Electron (file:// protocol doesn't support BrowserRouter history)
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppLayout from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import EnergyMonitoring from './pages/EnergyMonitoring';
import WasteManagement from './pages/WasteManagement';
import CarbonCalculator from './pages/CarbonCalculator';
import GreenChallenges from './pages/GreenChallenges';
import Suggestions from './pages/Suggestions';
import Reports from './pages/Reports';
import StudentProfile from './pages/StudentProfile';
import AdminHub from './pages/AdminHub';

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Application Main Layout Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/energy" element={<EnergyMonitoring />} />
              <Route path="/waste" element={<WasteManagement />} />
              <Route path="/calculator" element={<CarbonCalculator />} />
              <Route path="/challenges" element={<GreenChallenges />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/admin" element={<AdminHub />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
