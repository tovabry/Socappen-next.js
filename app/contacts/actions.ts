"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteContact(formData: FormData) {
	const id = formData.get("id") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/${id}`, {
		method: "DELETE",
		headers: { Cookie: `token=${token}` },
	});
	if (!res.ok) {
		console.error("Delete failed:", res.status, await res.text());
		return;
	}
	redirect("/contacts");
}

export async function updateContact(formData: FormData) {
	const contactId = formData.get("contactId") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const currentUserRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		{
			headers: { Cookie: `token=${token}` },
		},
	);
	const currentUser = await currentUserRes.json();

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/contact/${contactId}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Cookie: `token=${token}`,
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
	redirect(`/contacts`);
}

export async function createContact(formData: FormData) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const currentUserRes = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		{
			headers: { Cookie: `token=${token}` },
		},
	);
	const currentUser = await currentUserRes.json();

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
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
	redirect("/contacts");
}
