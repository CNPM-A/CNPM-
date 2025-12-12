// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ParentLayout from "../components/layout/ParentLayout";

// --- Lazy loaded pages ---

// Parent pages
const ParentDashboard = lazy(() => import("../pages/parent/ParentDashboard"));
const ParentTracking = lazy(() => import("../pages/parent/ParentTracking"));
const ParentNotifications = lazy(() => import("../pages/parent/ParentNotifications"));
const ParentProfile = lazy(() => import("../pages/parent/ParentProfile"));
const ParentSettings = lazy(() => import("../pages/parent/ParentSettings"));
const Login_Parents = lazy(() => import("../pages/parent/Login_Parents"));

// Shared pages
const Login = lazy(() => import("../pages/shared/login"));
const NotFound = lazy(() => import("../pages/shared/NotFound"));

// Loading component
const Loader = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center z-50">
    <div className="text-white text-3xl font-bold animate-pulse">SchoolBus Tracker</div>
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/parent/login" element={<Login_Parents />} />

        {/* ===== PARENT ROUTES ===== */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          <Route path="tracking" element={<ParentTracking />} />
          <Route path="notifications" element={<ParentNotifications />} />
          <Route path="profile" element={<ParentProfile />} />
          <Route path="settings" element={<ParentSettings />} />
        </Route>

        {/* ===== ROOT REDIRECT ===== */}
        <Route path="/" element={<Navigate to="/parent/login" replace />} />

        {/* ===== 404 FALLBACK ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}