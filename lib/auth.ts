import { jwtDecode } from "jwt-decode";

export const saveToken = (token: string) =>
	localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

export async function fetchCurrentUser(token: string) {
	const decoded = jwtDecode<{ sub: string; roles: string[] }>(token);
	const res = await fetch("http://localhost:8080/api/users/me", {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		throw new Error("Failed to fetch user");
	}
	const data = await res.json();
	return {
		id: data.id,
		email: decoded.sub,
		roles: decoded.roles ?? [],
	};
}
