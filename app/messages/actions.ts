"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createConversation() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const userRes = await fetch("http://localhost:8080/api/users/me", {
		headers: { Cookie: `token=${token}` },
	});
	const currentUser = await userRes.json();
	console.log("currentUser:", currentUser);

	const res = await fetch("http://localhost:8080/api/conversations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({ userId: currentUser.id }),
	});

	if (!res.ok) {
		console.error("Create conversation failed:", res.status, await res.text());
		return;
	}

	const conversation = await res.json();
	redirect(`/messages/${conversation.id}`);
}
