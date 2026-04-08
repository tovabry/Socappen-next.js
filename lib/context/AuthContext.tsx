"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, getToken, removeToken } from "../auth";

interface AuthUser {
	id: number;
	email: string;
	roles: string[];
}

interface AuthContextValue {
	user: AuthUser | null;
	setUser: (user: AuthUser | null) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		const token = getToken();
		if (token) {
			fetchCurrentUser(token)
				.then(setUser)
				.catch(() => removeToken());
		}
	}, []);

	const logout = () => {
		removeToken();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an Authprovider");
	}
	return context;
}
