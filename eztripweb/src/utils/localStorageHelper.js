const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getStoredToken() {
	return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
	const rawUser = localStorage.getItem(USER_KEY);

	if (!rawUser) {
		return null;
	}

	try {
		return JSON.parse(rawUser);
	} catch {
		localStorage.removeItem(USER_KEY);
		return null;
	}
}

export function setStoredAuth(token, user) {
	if (token) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	if (token === null) {
		localStorage.removeItem(TOKEN_KEY);
	}

	if (user) {
		localStorage.setItem(USER_KEY, JSON.stringify(user));
	} else if (user === null) {
		localStorage.removeItem(USER_KEY);
	}
}

export function clearStoredAuth() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}

export function hasStoredAuth() {
	return Boolean(getStoredToken()) && Boolean(getStoredUser());
}
