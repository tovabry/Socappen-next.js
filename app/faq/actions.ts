"use server";

import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteFaq(formData: FormData) {
	const id = formData.get("id") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`,
		{
			method: "DELETE",
		},
	);
	if (!res.ok) {
		console.error("Delete failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/faq");
	redirect(`/faq`);
}

export async function updateFaq(formData: FormData) {
	const faqId = formData.get("faqId") as string;

	const currentUserRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await currentUserRes.json();

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/faq/${faqId}`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: currentUser.id,
				question: formData.get("question"),
				Answer: formData.get("answer"),
			}),
		},
	);
	if (!res.ok) {
		console.error("Update failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/faq");
	redirect("/faq");
}

export async function createFaq(formData: FormData) {
	const currentUserRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await currentUserRes.json();

	const res = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
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
	revalidatePath("/faq");
	redirect("/faq");
}
