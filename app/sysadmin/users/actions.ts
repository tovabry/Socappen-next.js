"use server";

import { revalidatePath } from "next/cache";
import { serverFetch } from "@/lib/serverFetch";

export async function grantPermission(formData: FormData) {
	const userId = Number(formData.get("userId"));
	const permissionId = Number(formData.get("permissionId"));

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/permissions`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId, permissionId }),
		},
	);

	if (!res.ok) {
		console.error("Grant permission failed:", res.status, await res.text());
		return;
	}

	revalidatePath("/sysadmin/users");
	revalidatePath(`/sysadmin/users/${userId}`);
}

export async function revokePermission(formData: FormData) {
	const userId = Number(formData.get("userId"));
	const permissionId = Number(formData.get("permissionId"));

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/permissions/${userId}/${permissionId}`,
		{ method: "DELETE" },
	);

	if (!res.ok) {
		console.error("Revoke permission failed:", res.status, await res.text());
		return;
	}

	revalidatePath("/sysadmin/users");
	revalidatePath(`/sysadmin/users/${userId}`);
}

export async function promoteToAdmin(formData: FormData) {
	const userId = Number(formData.get("userId"));

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/promote/${userId}`,
		{ method: "PUT" },
	);

	if (!res.ok) {
		console.error("Promote failed:", res.status, await res.text());
		return;
	}

	revalidatePath("/sysadmin/users");
}

export async function demoteToUser(formData: FormData) {
	const userId = Number(formData.get("userId"));

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/sysadmin/demote/${userId}`,
		{ method: "PUT" },
	);

	if (!res.ok) {
		console.error("Demote failed:", res.status, await res.text());
		return;
	}

	revalidatePath("/sysadmin/users");
}

export async function deleteUserAccount(formData: FormData) {
	const userId = formData.get("userId");

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
		{ method: "DELETE" },
	);

	if (!res.ok) {
		console.error("Delete user failed:", res.status, await res.text());
		return;
	}

	revalidatePath("/sysadmin/users");
}
