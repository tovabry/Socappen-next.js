"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser } from "../auth";

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

/*
 Provide authentication context to the app, including user info and logout function.
 On first load, it checks for a token and fetches the current user info if a token exists.
*/
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);

	useEffect(() => {
		fetchCurrentUser()
			.then(setUser)
			.catch(() => setUser(null));
	}, []);

	const logout = async () => {
		await fetch("http://localhost:8080/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});
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
