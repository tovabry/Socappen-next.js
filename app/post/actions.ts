"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function createPost(formData: FormData) {
	"use server";
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const userRes = await fetch("http://localhost:8080/api/users/me", {
		headers: { Cookie: `token=${token}` },
	});
	const currentUser = await userRes.json();

	const res = await fetch("http://localhost:8080/api/posts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			userId: currentUser.id,
			title: formData.get("title"),
			content: formData.get("content"),
		}),
	});

	if (!res.ok) {
		console.error("Create post failed:", res.status, await res.text());
		return;
	}

	redirect("/post");
}
