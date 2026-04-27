"use server";

import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import { revalidatePath } from "next/cache";

// Normal post crud functions
export async function createPost(formData: FormData) {
	const userRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const currentUser = await userRes.json();

	const urls = formData.getAll("mediaUrl") as string[];
	const types = formData.getAll("mediaType") as string[];
	const media = urls
		.map((url, index) => ({
			url,
			mediaType: types[index],
			sortOrder: index + 1,
		}))
		.filter((m) => m.url.trim() !== "");

	console.log("Creating post with media:", media);

	const res = await serverFetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
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

	revalidatePath("/post");
	redirect("/post");
}

export async function updatePost(formData: FormData) {
	const id = formData.get("postId") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: formData.get("title"),
				content: formData.get("content"),
			}),
		},
	);
	if (!res.ok) {
		console.error("Update post failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/post");
	redirect("/post");
}

export async function deletePost(formData: FormData) {
	const id = formData.get("postId") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`,
		{
			method: "DELETE",
		},
	);
	if (!res.ok) {
		console.error("Delete post failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/post");
	redirect("/post");
}

// MediaPost crud functions
export async function addPostMedia(formData: FormData) {
	const postId = formData.get("postId") as string;
	const sortOrder = formData.get("sortOrder") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts/media`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				postId: Number(postId),
				mediaType: (formData.get("mediaType") as string).toLowerCase(),
				url: formData.get("url"),
				sortOrder: Number(sortOrder),
			}),
		},
	);
	if (!res.ok) {
		console.error("Add post media failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/post");
	redirect(`/post/${postId}/edit`);
}

export async function deletePostMedia(formData: FormData) {
	const postId = formData.get("postId") as string;
	const mediaId = formData.get("mediaId") as string;
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts/media/${mediaId}`,
		{
			method: "DELETE",
		},
	);
	if (!res.ok) {
		console.error("Delete post media failed:", res.status, await res.text());
		return;
	}
	revalidatePath("/post");
	redirect(`/post/${postId}/edit`);
}
