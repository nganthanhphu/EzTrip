import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

function RoleRoute({ role, children }) {
	const { currentUser, isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
	}

	const currentRole = currentUser?.role || currentUser?.roleId || currentUser?.roleName;
	const normalizedCurrentRole = String(currentRole || "").toUpperCase();
	const normalizedRequiredRole = String(role || "").toUpperCase();

	if (normalizedRequiredRole && normalizedCurrentRole !== normalizedRequiredRole) {
		return <Navigate to="/" replace />;
	}

	return children || <Outlet />;
}

export default RoleRoute;
