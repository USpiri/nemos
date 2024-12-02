import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

export const RouteWatcher = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      localStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  return null;
};

export const RedirectToLastRoute = ({ fallback }: { fallback: string }) => {
  const lastRoute = localStorage.getItem("lastRoute");
  return lastRoute ? (
    <Navigate to={lastRoute} replace />
  ) : (
    <Navigate to={fallback} replace />
  );
};
