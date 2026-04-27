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
	loading: boolean;
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
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchCurrentUser()
			.then(setUser)
			.catch(() => setUser(null))
			.finally(() => setLoading(false));
	}, []);

	const logout = async () => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
			method: "POST",
			credentials: "include",
		});
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, setUser, logout }}>
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
