import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AiAssistant from "../pages/AiAssistant";
import DsaProgress from "../pages/DsaProgress";
import Interviewpreparation from "../pages/Interviewpreparation";
import Subject from "../pages/Subjects";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/AiAssistant" element={
        <ProtectedRoute><AiAssistant /></ProtectedRoute>
      } />
      <Route path="/DsaProgress" element={
        <ProtectedRoute><DsaProgress /></ProtectedRoute>
      } />
      <Route path="/Interviewpreparation" element={
        <ProtectedRoute><Interviewpreparation /></ProtectedRoute>
      } />
      <Route path="/subject" element={
        <ProtectedRoute><Subject /></ProtectedRoute>
      } />

    </Routes>
  );
};

export default AppRoutes;