import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

function resolveFallbackPathByRole(role) {
	if (role === 3) {
		return "/provider";
	}

	if (role === 2) {
		return "/";
	}

	return "/login";
}

function RoleRoute({ role, children }) {
	const { currentUser, isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
	}

	const currentRole = currentUser?.role;

	if (role && currentRole !== role) {
		return <Navigate to={resolveFallbackPathByRole(currentRole)} replace />;
	}

	return children || <Outlet />;
}

export default RoleRoute;
