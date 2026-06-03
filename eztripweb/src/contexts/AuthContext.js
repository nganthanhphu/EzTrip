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

export default AuthContext;

export function AuthContextProvider({ children }) {
	const [token, setToken] = useState(() => getStoredToken());
	const [currentUser, dispatch] = useReducer(MyUserReducer, getStoredUser());
	const [loading, setLoading] = useState(Boolean(getStoredToken()) && !getStoredUser());

	useEffect(() => {
		let cancelled = false;

		async function hydrateUser() {
			if (!token || currentUser) {
				setLoading(false);
				return;
			}

			try {
				const user = await fetchCurrentUser();

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

			const user = await fetchCurrentUser();
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

	const syncCurrentUser = useCallback((user) => {
		if (!user) {
			return;
		}

		if (token) {
			setStoredAuth(token, user);
		}

		dispatch({ type: "LOGIN", payload: user });
	}, [token]);

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
			syncCurrentUser,
		}),
		[token, currentUser, loading, login, logout, syncCurrentUser],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}