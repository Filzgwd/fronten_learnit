import { Navigate, useLocation } from "react-router";
import { useAuth } from "./authContext";

const PrivateAuth = ({ children }) => {
  const { user, loading } = useAuth();

  const location = useLocation();

  if (loading) return <LoadingScreen />;
  if (!user)
    return (
      <Navigate to="/signin" replace state={{ from: location.pathname }} />
    );
  return children;
};

function LoadingScreen() {
  return (
    <div className="page-loader">
      <p>Memuat...</p>
    </div>
  );
}

export default PrivateAuth;
