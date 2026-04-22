import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function RequireAuth() {
  const { user, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return <div style={{ padding: 16 }}>Đang xác thực...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

