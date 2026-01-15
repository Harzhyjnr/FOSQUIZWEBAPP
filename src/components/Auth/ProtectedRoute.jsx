import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userStr = localStorage.getItem("user");
  const isAuthenticated = !!userStr;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If user is admin, redirect to admin dashboard
  try {
    const user = JSON.parse(userStr);
    if (user.isAdmin) {
      return <Navigate to="/admin" />;
    }
  } catch (e) {
    // Continue if parsing fails
  }

  return <Outlet />;
};

export default ProtectedRoute;
