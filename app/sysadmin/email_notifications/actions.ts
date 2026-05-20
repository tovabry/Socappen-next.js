"use server";
import { serverFetch } from "@/lib/serverFetch";

export async function addEmailForNotifications(formData: FormData) {
	const email = formData.get("email");

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/notification-email`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		},
	);
	if (!res.ok) {
		console.error("Add email failed:", res.status, await res.text());
	}
}
