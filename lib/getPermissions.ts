import { serverFetch } from "./serverFetch";

export type PermissionName =
	| "manage_user"
	| "manage_faq"
	| "manage_post"
	| "manage_contact"
	| "manage_permission"
	| "view_logs";

interface MeResponse {
	id: number;
	email: string;
	role: string;
	permissions: string[]; // viktigt: permissions (plural) + string[]
}

export async function getPermissions(): Promise<Set<string>> {
	const meRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		{
			cache: "no-store",
		},
	);

	if (!meRes.ok) {
		console.error("users/me failed:", meRes.status, await meRes.text());
		return new Set();
	}

	const me: MeResponse = await meRes.json();
	return new Set((me.permissions ?? []).map((p) => p.trim()));
}

export async function hasPermission(
	permission: PermissionName,
): Promise<boolean> {
	const permissions = await getPermissions();
	return permissions.has(permission);
}
