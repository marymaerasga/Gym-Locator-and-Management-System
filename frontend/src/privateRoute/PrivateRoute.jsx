import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ clientInfo, navigateRoute }) => {
  return localStorage.getItem(clientInfo) ? (
    <Navigate to={navigateRoute} replace />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
