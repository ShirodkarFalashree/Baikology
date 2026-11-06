import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import QuestionnairePage from './pages/QuestionnairePage';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<QuestionnairePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />

        {/* Dashboard & Dedicated Tab Routes */}
        <Route path="/dashboard" element={<DashboardPage initialTab="home" />} />
        <Route path="/dashboard/:tab" element={<DashboardPage />} />
        <Route path="/home" element={<DashboardPage initialTab="home" />} />
        <Route path="/cycle" element={<DashboardPage initialTab="cycle" />} />
        <Route path="/my-cycle" element={<DashboardPage initialTab="cycle" />} />
        <Route path="/mood" element={<DashboardPage initialTab="mood" />} />
        <Route path="/mood-check-in" element={<DashboardPage initialTab="mood" />} />
        <Route path="/learn" element={<DashboardPage initialTab="learn" />} />
        <Route path="/insights" element={<DashboardPage initialTab="learn" />} />
        <Route path="/profile" element={<DashboardPage initialTab="settings" />} />
        <Route path="/settings" element={<DashboardPage initialTab="settings" />} />

        {/* Graceful fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
