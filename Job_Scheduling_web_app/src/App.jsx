import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { JobProvider, useJobContext } from './context/JobContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import './index.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useJobContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <JobProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </JobProvider>
  );
}

export default App;
