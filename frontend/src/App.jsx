import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MyProfile from "./pages/user-taps/MyProfile"; // Import Profile Page

const App = () => {
  // 🔹 Store user in state
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // 🔹 Function to get user role from state
  const getUserRole = () => (user ? user.role : null);

  // 🔹 Protected Route Component
  const ProtectedRoute = ({ element, allowedRoles }) => {
    const userRole = getUserRole();

    if (!userRole) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/userdashboard" replace />;
    }

    return element;
  };

  return (
    <Router>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔹 Profile Page (Pass user & setUser) */}
        <Route path="/profile" element={<MyProfile user={user} setUser={setUser} />} />

        {/* 🔹 User Dashboard - Only for Users */}
        <Route
          path="/userdashboard"
          element={<ProtectedRoute element={<UserDashboard />} allowedRoles={["user"]} />}
        />

        {/* 🔹 Admin Dashboard - Only for Admins */}
        <Route
          path="/admindashboard"
          element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
        />
      </Routes>
    </Router>
  );
};

export default App;