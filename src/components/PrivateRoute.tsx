import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode; // aceita JSX.Element ou vários elementos
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token"); 
  const isTemp = localStorage.getItem("isTemp") === "true"; 

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isTemp && location.pathname !== "/alterar-senha") {
    return <Navigate to="/alterar-senha" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;