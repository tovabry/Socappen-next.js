"use server";

import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteContact(formData: FormData) {
	const id = formData.get("id") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`,
		{
			method: "DELETE",
		},
	);
	if (!res.ok) {
		console.error("Delete failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/contacts");
	redirect("/contacts");
}

export async function updateContact(formData: FormData) {
	const contactId = formData.get("contactId") as string;

	const currentUserRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await currentUserRes.json();

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userId: currentUser.id,
				title: formData.get("title"),
				img_url: formData.get("imgUrl"),
				mail: formData.get("mail"),
				phone: formData.get("phone"),
			}),
		},
	);
	if (!res.ok) {
		console.error("Update failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/contacts");
	redirect(`/contacts`);
}

export async function createContact(formData: FormData) {
	const currentUserRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await currentUserRes.json();

	const res = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			userId: currentUser.id,
			title: formData.get("title"),
			img_url: formData.get("imgUrl"),
			mail: formData.get("mail"),
			phone: formData.get("phone"),
		}),
	});
	if (!res.ok) {
		console.error("Create failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/contacts");
	redirect("/contacts");
}
