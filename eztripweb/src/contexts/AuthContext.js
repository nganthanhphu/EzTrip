import React, { createContext, useCallback, useEffect, useMemo, useReducer, useState } from "react";
import MyUserReducer from "@reducers/MyUserReducer";
import { fetchCurrentUser, loginWithPassword } from "@services/authService";
import {
	clearStoredAuth,
	getStoredToken,
	getStoredUser,
	setStoredAuth,
} from "@utils/authCookieHelper";

const AuthContext = createContext(null);

function normalizeUser(user) {
	if (!user) {
		return null;
	}

	return {
		...user,
		name: user.name || user.fullname || "",
	};
}

export default AuthContext;

export function AuthContextProvider({ children }) {
	const [token, setToken] = useState(() => getStoredToken());
	const [currentUser, dispatch] = useReducer(MyUserReducer, normalizeUser(getStoredUser()));
	const [loading, setLoading] = useState(Boolean(getStoredToken()) && !getStoredUser());

	useEffect(() => {
		let cancelled = false;

		async function hydrateUser() {
			if (!token || currentUser) {
				setLoading(false);
				return;
			}

			try {
				const user = normalizeUser(await fetchCurrentUser());

				if (cancelled) {
					return;
				}

				setStoredAuth(token, user);
				dispatch({ type: "LOGIN", payload: user });
			} catch {
				if (cancelled) {
					return;
				}

				clearStoredAuth();
				setToken(null);
				dispatch({ type: "LOGOUT" });
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		hydrateUser();

		return () => {
			cancelled = true;
		};
	}, [token, currentUser]);

	const login = useCallback(async (phoneNumber, password) => {
		setLoading(true);
		try {
			const authResponse = await loginWithPassword(phoneNumber, password);
			const nextToken = authResponse?.token;

			if (!nextToken) {
				throw new Error("Không nhận được JWT từ server.");
			}

			setToken(nextToken);
			setStoredAuth(nextToken, null);

			const user = normalizeUser(await fetchCurrentUser());
			setStoredAuth(nextToken, user);
			dispatch({ type: "LOGIN", payload: user });

			return { token: nextToken, user };
		} catch (error) {
			clearStoredAuth();
			setToken(null);
			dispatch({ type: "LOGOUT" });
			throw error;
		} finally {
			setLoading(false);
		}
	}, []);

	const logout = useCallback(() => {
		clearStoredAuth();
		setToken(null);
		dispatch({ type: "LOGOUT" });
		setLoading(false);
	}, []);

	const value = useMemo(
		() => ({
			token,
			currentUser,
			loading,
			isAuthenticated: Boolean(token && currentUser),
			login,
			logout,
		}),
		[token, currentUser, loading, login, logout],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}