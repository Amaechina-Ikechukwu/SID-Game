import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { ToastProvider } from "./context/ToastContext";
import { Projector } from "./pages/Projector";
import { Login } from "./pages/Login";
import { Lobby } from "./pages/Lobby";
import { Dashboard } from "./pages/Dashboard";
import { Activity } from "./pages/Activity";
import { Navigation } from "./components/Navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>LOADING...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const FacilitatorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>LOADING...</div>;
  if (!user || !isAdmin) return <Navigate to="/lobby" />;
  return <>{children}</>;
};

const RootRedirect = () => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div>LOADING...</div>;
  if (!user) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/dashboard" />;
  return <Navigate to="/lobby" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <ToastProvider>
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/projector" element={<Projector />} />
              <Route path="/lobby" element={
                <ProtectedRoute>
                  <Lobby />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <FacilitatorRoute>
                  <Dashboard />
                </FacilitatorRoute>
              } />
               <Route path="/activity/:id" element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              } />
              <Route path="/" element={<RootRedirect />} />
            </Routes>
          </ToastProvider>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
