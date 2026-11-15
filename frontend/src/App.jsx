import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import NotFoundPage from './pages/NotFoundPage';

// Dashboard Module Pages
import DashboardPage from './pages/DashboardPage';
import FarmMapPage from './pages/FarmMapPage';
import SatelliteInsightsPage from './pages/SatelliteInsightsPage';
import WeatherPage from './pages/WeatherPage';
import CropPlannerPage from './pages/CropPlannerPage';
import CropRotationPage from './pages/CropRotationPage';
import SchemesPage from './pages/SchemesPage';
import SupportPage from './pages/SupportPage';
import ReportsPage from './pages/ReportsPage';
import FarmerProfilePage from './pages/FarmerProfilePage';

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Guided Profile Setup (requires login, but not complete profile) */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute requireCompleteProfile={false}>
                <ProfileSetupPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/farm"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FarmMapPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/satellite"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SatelliteInsightsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/weather"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <WeatherPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/crops"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CropPlannerPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/calendar"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CropPlannerPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/rotation"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CropRotationPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/schemes"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SchemesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/support"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <SupportPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FarmerProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ErrorBoundary>
  );
}

export default App;
