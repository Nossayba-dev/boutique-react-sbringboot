import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import de vos composants
import AdminDashboard from "./componnent/admin/DashboardLayout";
import Dashboard from "./componnent/dashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Route principale : Dashboard Client */}
        <Route path="/" element={<Dashboard />} />

        {/* Route Administration */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Redirection automatique si l'URL est inconnue (optionnel) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;