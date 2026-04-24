"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// Normal post crud functions
export async function createPost(formData: FormData) {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
		headers: { Cookie: `token=${token}` },
	});
	const currentUser = await userRes.json();

	const urls = formData.getAll("mediaUrl") as String[];
	const types = formData.getAll("mediaType") as String[];
	const media = urls
		.map((url, index) => ({
			url,
			mediaType: types[index],
			sortOrder: index + 1,
		}))
		.filter((m) => m.url.trim() !== "");

	console.log("Creating post with media:", media);

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			userId: currentUser.id,
			title: formData.get("title"),
			content: formData.get("content"),
			media: media,
		}),
	});

	if (!res.ok) {
		console.error("Create post failed:", res.status, await res.text());
		return;
	}

	redirect("/post");
}

export async function updatePost(formData: FormData) {
	const id = formData.get("postId") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			title: formData.get("title"),
			content: formData.get("content"),
		}),
	});
	if (!res.ok) {
		console.error("Update post failed:", res.status, await res.text());
		return;
	}
	redirect("/post");
}

export async function deletePost(formData: FormData) {
	const id = formData.get("postId") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
		method: "DELETE",
		headers: {
			Cookie: `token=${token}`,
		},
	});
	if (!res.ok) {
		console.error("Delete post failed:", res.status, await res.text());
		return;
	}
	redirect("/post");
}

// MediaPost crud functions
export async function addPostMedia(formData: FormData) {
	const postId = formData.get("postId") as string;
	const sortOrder = formData.get("sortOrder") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/media`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Cookie: `token=${token}`,
		},
		body: JSON.stringify({
			postId: Number(postId),
			mediaType: (formData.get("mediaType") as string).toLowerCase(),
			url: formData.get("url"),
			sortOrder: Number(sortOrder),
		}),
	});
	if (!res.ok) {
		console.error("Add post media failed:", res.status, await res.text());
		return;
	}
	redirect(`/post/${postId}/edit`);
}

export async function deletePostMedia(formData: FormData) {
	const postId = formData.get("postId") as string;
	const mediaId = formData.get("mediaId") as string;
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts/media/${mediaId}`,
		{
			method: "DELETE",
			headers: {
				Cookie: `token=${token}`,
			},
		},
	);
	if (!res.ok) {
		console.error("Delete post media failed:", res.status, await res.text());
		return;
	}
	redirect(`/post/${postId}/edit`);
}
