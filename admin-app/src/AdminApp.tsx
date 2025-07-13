import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import './styles/apple-intelligence.css';

const AdminApp: React.FC = () => {
  return (
    <Routes>
      {/* Redirect root to admin panel */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      
      {/* Admin Panel Route */}
      <Route path="/admin" element={<AdminPanel />} />
      
      {/* Catch all other routes and redirect to admin */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminApp; 