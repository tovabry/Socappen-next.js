/**
 * @returns user info such as id, email and array of roles
 */
export async function fetchCurrentUser() {
	const res = await fetch("http://localhost:8080/api/users/me", {
		credentials: "include",
	});
	if (!res.ok) {
		throw new Error("Failed to fetch user");
	}
	const data = await res.json();

	if (!data.id || !data.email) {
		throw new Error("Invalid user data");
	}
	return {
		id: data.id,
		email: data.email,
		roles: data.roles ?? [],
	};
}
