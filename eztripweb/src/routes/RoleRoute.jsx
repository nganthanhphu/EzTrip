import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

function normalizeRole(value) {
	const normalized = String(value || "").trim().toUpperCase();
	if (!normalized) {
		return "";
	}

	return normalized.startsWith("ROLE_") ? normalized.replace("ROLE_", "") : normalized;
}

function resolveFallbackPathByRole(role) {
	if (role === "PROVIDER") {
		return "/provider";
	}

	if (role === "CUSTOMER") {
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

	const currentRole = currentUser?.role || currentUser?.roleId || currentUser?.roleName;
	const normalizedCurrentRole = normalizeRole(currentRole);
	const normalizedRequiredRole = normalizeRole(role);

	if (normalizedRequiredRole && normalizedCurrentRole !== normalizedRequiredRole) {
		return <Navigate to={resolveFallbackPathByRole(normalizedCurrentRole)} replace />;
	}

	return children || <Outlet />;
}

export default RoleRoute;
