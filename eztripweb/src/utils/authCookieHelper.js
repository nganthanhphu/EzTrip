import cookies from "react-cookies";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const AUTH_COOKIE_OPTIONS = {
	path: "/",
	sameSite: "lax",
};
const AUTH_COOKIE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function getAuthCookieOptions() {
	return {
		...AUTH_COOKIE_OPTIONS,
		expires: new Date(Date.now() + AUTH_COOKIE_TTL_MS),
	};
}

export function getStoredToken() {
	return cookies.load(TOKEN_KEY) || null;
}

export function getStoredUser() {
	const rawUser = cookies.load(USER_KEY);

	if (!rawUser) {
		return null;
	}

	try {
		return typeof rawUser === "string" ? JSON.parse(rawUser) : rawUser;
	} catch {
		clearStoredAuth();
		return null;
	}
}

export function setStoredAuth(token, user) {
	if (token) {
		cookies.save(TOKEN_KEY, token, getAuthCookieOptions());
	} else {
		cookies.remove(TOKEN_KEY, AUTH_COOKIE_OPTIONS);
	}

	if (user) {
		cookies.save(USER_KEY, JSON.stringify(user), getAuthCookieOptions());
	} else if (user === null) {
		cookies.remove(USER_KEY, AUTH_COOKIE_OPTIONS);
	}
}

export function clearStoredAuth() {
	cookies.remove(TOKEN_KEY, AUTH_COOKIE_OPTIONS);
	cookies.remove(USER_KEY, AUTH_COOKIE_OPTIONS);
}