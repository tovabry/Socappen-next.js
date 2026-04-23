import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { jwtDecode } from "jwt-decode";
import { Pencil } from "lucide-react";
import { cookies } from "next/headers";

type JwtPayload = { roles: string[]; sub: string; exp: number };

interface Props {
	params: Promise<{ id: string }>;
}

interface ResponsePost {
	id: number;
	userId: number;
	title: string;
	content: string;
	createdAt: string;
}

interface ResponsePostMedia {
	postId: number;
	mediaType: string;
	url: string;
	sortOrder: number;
}

export default async function PostDetailPage({ params }: Props) {
	const { id } = await params;

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	let isAdmin = false;
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			isAdmin = decodedToken.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			);
		} catch {
			console.error("Invalid token");
		}
	}

	const [res, mediaRes] = await Promise.all([
		serverFetch(`http://localhost:8080/api/posts/${id}`),
		serverFetch(`http://localhost:8080/api/posts/${id}/media`),
	]);

	if (!res.ok) {
		return (
			<div className="w-full">
				<Header title="Inlägg" backRouteLink="/post" />
				<main className="mx-10 mt-10">
					<p className="text-white">Inlägget hittades inte.</p>
				</main>
			</div>
		);
	}

	const post: ResponsePost = await res.json();
	const media: ResponsePostMedia[] = mediaRes.ok ? await mediaRes.json() : [];

	return (
		<div className="w-full">
			<Header title="Inlägg" backRouteLink="/post" />
			<main className="mx-6 mt-6">
				<article className="bg-white rounded-lg shadow-md p-6 overflow-hidden">
					<div className="flex justify-between items-start">
						<div className="min-w-0">
							<time
								dateTime={post.createdAt}
								className="text-xs text-gray-400 mt-1 block"
							>
								{formatDate(post.createdAt)}
							</time>
							<h1 className="text-2xl font-semibold wrap-break-word">
								{post.title}
							</h1>
						</div>
						{isAdmin && (
							<a
								href={`/post/${id}/edit`}
								aria-label={`Redigera ${post.title}`}
								className="flex items-center gap-2 px-3 py-1 text-sm border rounded-md shadow-md"
							>
								<Pencil size={14} />
								Redigera
							</a>
						)}
					</div>
					<p className="mt-6 text-gray-700 whitespace-pre-wrap wrap-break-word">
						{post.content}
					</p>
					{media.length > 0 && (
						<div className="mt-6 flex flex-col gap-4">
							{media
								.sort((a, b) => a.sortOrder - b.sortOrder)
								.map((m, i) =>
									m.mediaType === "image" ? (
										<img
											key={i}
											src={m.url}
											alt={`Media ${i + 1} för ${post.title}`}
											className="rounded-md w-full object-cover shadow-md"
										/>
									) : m.mediaType === "video" ? (
										<iframe
											key={i}
											src={getYouTubeEmbedUrl(m.url)}
											title={`Video ${i + 1} för ${post.title}`}
											allowFullScreen
											className="rounded-md w-full aspect-video shadow-md"
										/>
									) : null,
								)}
						</div>
					)}
				</article>
			</main>
		</div>
	);
}

function getYouTubeEmbedUrl(url: string): string {
	const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
	return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}
