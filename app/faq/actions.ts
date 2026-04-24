"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteFaq(formData: FormData) {
	const id = formData.get("id") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`, {
		method: "DELETE",
		headers: { Cookie: `token=${token}` },
	});
	if (!res.ok) {
		console.error("Delete failed:", res.status, await res.text());
		return;
	}
	redirect("/faq");
}

export async function updateFaq(formData: FormData) {
	const faqId = formData.get("faqId") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const currentUserRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		{
			headers: { Cookie: `token=${token}` },
		},
	);
	const currentUser = await currentUserRes.json();

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/${faqId}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			userId: currentUser.id,
			question: formData.get("question"),
			Answer: formData.get("answer"),
		}),
	});
	if (!res.ok) {
		console.error("Update failed:", res.status, await res.text());
		return;
	}
	redirect(`/faq`);
}

export async function createFaq(formData: FormData) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const currentUserRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		{
			headers: { Cookie: `token=${token}` },
		},
	);
	const currentUser = await currentUserRes.json();

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			userId: currentUser.id,
			question: formData.get("question"),
			Answer: formData.get("answer"),
		}),
	});
	if (!res.ok) {
		console.error("Create failed:", res.status, await res.text());
		return;
	}
	redirect("/faq");
}
