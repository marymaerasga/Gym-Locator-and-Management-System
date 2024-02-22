import { Navigate, Outlet } from "react-router-dom";

const GuardRoute = ({ clientInfo, navigateLoginRoute }) => {
  return localStorage.getItem(clientInfo) ? (
    <Outlet />
  ) : (
    <Navigate to={navigateLoginRoute} replace />
  );
};

export default GuardRoute;
