import { useMsal } from "@azure/msal-react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute({ component: Component, ...rest }) {
  const { accounts } = useMsal();

  return accounts.length > 0 ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;
