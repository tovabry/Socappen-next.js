import { Header } from "@/components/Header";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/serverFetch";
import {
	updatePost,
	deletePost,
	addPostMedia,
	deletePostMedia,
} from "../../actions";

type JwtPayload = { roles: string[]; sub: string; exp: number };

interface Props {
	params: Promise<{ id: string }>;
}

interface ResponsePost {
	id: number;
	title: string;
	content: string;
}

interface ResponsePostMedia {
	id: number;
	postId: number;
	mediaType: string;
	url: string;
	sortOrder: number;
}

export default async function PostEditPage({ params }: Props) {
	const { id } = await params;

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	let isAdmin = false;
	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			isAdmin = decoded.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			);
		} catch {
			console.error("Invalid token");
		}
	}

	if (!isAdmin) redirect(`/post/${id}`);

	const [postRes, mediaRes] = await Promise.all([
		serverFetch(`http://localhost:8080/api/posts/${id}`),
		serverFetch(`http://localhost:8080/api/posts/${id}/media`),
	]);

	const post: ResponsePost = await postRes.json();
	const media: ResponsePostMedia[] = mediaRes.ok ? await mediaRes.json() : [];

	return (
		<div className="w-full">
			<Header title="Redigera inlägg" backRouteLink={`/post/${id}`} />
			<main className="mx-6 my-6 flex flex-col gap-6">
				<section className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">Innehåll</h2>
					<form action={updatePost} className="flex flex-col gap-4">
						<input type="hidden" name="postId" value={id} />
						<div className="flex flex-col gap-1">
							<label htmlFor="title" className="text-sm font-medium">
								Titel
							</label>
							<input
								id="title"
								name="title"
								defaultValue={post.title}
								className="p-2 border rounded-md"
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="content" className="text-sm font-medium">
								Innehåll
							</label>
							<textarea
								id="content"
								name="content"
								defaultValue={post.content}
								rows={8}
								className="p-2 border rounded-md resize-none"
								required
							/>
						</div>
						<button
							type="submit"
							className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
						>
							Spara
						</button>
					</form>
				</section>

				<section className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-4">Media</h2>
					{media.length > 0 && (
						<ul className="flex flex-col gap-2 mb-6">
							{media
								.sort((a, b) => a.sortOrder - b.sortOrder)
								.map((m) => (
									<li
										key={m.id}
										className="flex items-center justify-between border rounded-md p-2 text-sm"
									>
										<span className="text-gray-400 mr-2">[{m.mediaType}]</span>
										<span className="truncate flex-1">{m.url}</span>
										<form action={deletePostMedia} className="ml-2">
											<input type="hidden" name="mediaId" value={m.id} />
											<input type="hidden" name="postId" value={id} />
											<button
												type="submit"
												className="text-red-500 text-xs border border-red-500 rounded px-2 py-1"
											>
												Ta bort
											</button>
										</form>
									</li>
								))}
						</ul>
					)}
					<form action={addPostMedia} className="flex flex-col gap-3">
						<input type="hidden" name="postId" value={id} />
						<input type="hidden" name="sortOrder" value={media.length + 1} />
						<div className="flex flex-col gap-1">
							<label htmlFor="mediaType" className="text-sm font-medium">
								Typ
							</label>
							<select
								id="mediaType"
								name="mediaType"
								className="p-2 border rounded-md"
							>
								<option value="image">Bild</option>
								<option value="video">Video</option>
							</select>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="url" className="text-sm font-medium">
								URL
							</label>
							<input
								id="url"
								name="url"
								className="p-2 border rounded-md"
								placeholder="https://..."
								required
							/>
						</div>
						<button
							type="submit"
							className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
						>
							Lägg till media
						</button>
					</form>
				</section>

				<section className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-2">Ta bort inlägg</h2>
					<p className="text-sm text-gray-500 mb-4">
						Åtgärden kan inte ångras.
					</p>
					<form action={deletePost}>
						<input type="hidden" name="postId" value={id} />
						<button
							type="submit"
							className="px-4 py-2 bg-red-500 text-white rounded-md text-sm"
						>
							Ta bort inlägg
						</button>
					</form>
				</section>
			</main>
		</div>
	);
}
