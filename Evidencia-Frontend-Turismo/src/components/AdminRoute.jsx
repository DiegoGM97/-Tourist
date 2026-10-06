import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user || user.rol !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;
