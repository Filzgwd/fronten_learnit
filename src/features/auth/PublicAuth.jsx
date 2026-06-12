import { Navigate, useLocation } from "react-router";
import { useAuth } from "./authContext";

const PublicAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const showLogin = location.state?.forceShow;

  if (loading) return <LoadingScreen />;
  if (user && !showLogin) return <Navigate to="/dashboard" replace />;
  return children;
};

function LoadingScreen() {
  return (
    <div className="page-loader">
      <p>Memuat...</p>
    </div>
  );
}

export default PublicAuth;
