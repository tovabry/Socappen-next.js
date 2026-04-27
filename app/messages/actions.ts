"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/serverFetch";

export async function createConversation() {
	const userRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await userRes.json();

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ participantIds: [currentUser.id] }),
		},
	);

	if (!res.ok) {
		console.error("Create conversation failed:", res.status, await res.text());
		return;
	}

	const conversation = await res.json();
	redirect(`/messages/${conversation.id}`);
}

export async function joinConversation(formData: FormData) {
	const conversationId = formData.get("conversationId") as string;

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/join`,
		{
			method: "POST",
		},
	);

	if (!res.ok) {
		console.error("Join failed:", res.status, await res.text());
		return;
	}
	redirect(`/messages/${conversationId}`);
}
