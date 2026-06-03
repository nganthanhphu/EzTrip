import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

function PrivateRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
	}

	return children || <Outlet />;
}

export default PrivateRoute;
