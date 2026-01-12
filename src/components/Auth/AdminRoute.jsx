import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.isAdmin === true;

  return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
