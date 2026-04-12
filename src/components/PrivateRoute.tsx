import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

interface PrivateRouteProps {
  children: React.ReactNode; 
  adminOnly?: boolean; 
}

const PrivateRoute = ({ children, adminOnly = false }: PrivateRouteProps) => {
  const token = localStorage.getItem("token"); 
  const isTemp = localStorage.getItem("isTemp") === "true"; 
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); 

  useEffect(() => {
    if (adminOnly && token) {
      axios
      .get("http://localhost:8080/auth/admin/check", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIsAdmin(res.data))
      .catch(() => setIsAdmin(false));
    } else if (!adminOnly) {
      setIsAdmin(false); 
    }
  }, [adminOnly, token]);


  if (!token) return <Navigate to="/" replace />;
  if (isTemp && location.pathname !== "/alterar-senha") {
    return <Navigate to="/alterar-senha" replace />;
  }
  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />; 

  return <>{children}</>;
};

export default PrivateRoute;