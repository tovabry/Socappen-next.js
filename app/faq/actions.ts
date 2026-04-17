"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteFaq(formData: FormData) {
	const id = formData.get("id") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`http://localhost:8080/api/faq/${id}`, {
		method: "DELETE",
		headers: { Cookie: `token=${token}` },
	});
	if (!res.ok) {
		console.error("Delete failed:", res.status, await res.text());
		return;
	}
	redirect("/faq");
}
