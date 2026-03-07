import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminProfile from './pages/AdminProfile';
import ParkingAreas from './pages/ParkingAreas';
import UserManagement from './pages/UserManagement';
import ActivitiesPage from './pages/ActivitiesPage';
import SlotOptimizer from './pages/admin_models/SlotOptimizer';
import SlotDivision from './pages/admin_models/SlotDivision';
import RebalanceModel from './pages/admin_models/RebalanceModel';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/parking" element={
            <ProtectedRoute>
              <ParkingAreas />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/activities" element={
            <ProtectedRoute>
              <ActivitiesPage />
            </ProtectedRoute>
          } />

          {/* ML Model Routes */}
          <Route path="/admin/models/slot-optimizer" element={
            <ProtectedRoute>
              <SlotOptimizer />
            </ProtectedRoute>
          } />

          <Route path="/admin/models/slot-division" element={
            <ProtectedRoute>
              <SlotDivision />
            </ProtectedRoute>
          } />

          <Route path="/admin/models/rebalance" element={
            <ProtectedRoute>
              <RebalanceModel />
            </ProtectedRoute>
          } />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />
} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;