import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Dashboard from './components/dashboard/Dashboard';
import ContactsView from './components/contacts/ContactsView';
import CalendarView from './components/calendar/CalendarView';
import InteractionsView from './components/interactions/InteractionsView';
import TasksView from './components/tasks/TasksView';
import DealsView from './components/negotiations/DealsView';

function AppContent() {
  const { currentView, loading } = useAppContext();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">Loading iCan...</div>
      </div>
    );
  }

  const views = {
    dashboard: <Dashboard />,
    contacts: <ContactsView />,
    calendar: <CalendarView />,
    interactions: <InteractionsView />,
    tasks: <TasksView />,
    pipeline: <DealsView />,
    profile: <ProfilePage />
  };

  return views[currentView] || <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Onboarding Route */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <OnboardingFlow />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interactions"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AppContent />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <div>Admin Dashboard - Coming Soon</div>
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AppProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
