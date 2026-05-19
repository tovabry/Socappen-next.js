import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { hasPermission } from "@/lib/getPermissions";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import { sortPostsByNewest } from "@/lib/sorting/sortPosts";
import Link from "next/link";

interface ResponsePost {
	id: number;
	userId: number;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export default async function PostPage() {
	const { isAdmin } = await getRoles();
	const hasPostPermissions = await hasPermission("manage_post");

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/posts?page=0&size=20`,
		{
			next: { revalidate: 300 }, // Cache for 5 minutes
		},
	);
	const posts: ResponsePost[] = await res.json();
	const sortedPosts = sortPostsByNewest(posts);

	return (
		<div className="w-full">
			<Header title="Posts" backRouteLink="/home" />
			<div className="flex justify-end mx-10 mt-5">
				{isAdmin && hasPostPermissions && (
					<Link
						href="/post/new"
						className="px-4 py-2 bg-(--accent-lightblue) text-white rounded-md text-sm shadow-md"
					>
						+ Nytt inlägg
					</Link>
				)}
			</div>
			<main className="flex flex-col gap-4 mx-6 mt-4 md:grid md:grid-cols-2 lg:grid-cols-3">
				{sortedPosts.map((post) => (
					<article
						key={post.id}
						className="bg-white rounded-lg shadow-md p-5 overflow-hidden"
					>
						<div className="flex justify-between items-start">
							<div className="min-w-0">
								<time
									dateTime={post.updatedAt || post.createdAt}
									className="text-xs text-gray-400 mt-1"
								>
									{formatDate(post.updatedAt || post.createdAt)}
								</time>
								<h2 className="text-lg font-semibold wrap-break-word">
									{post.title}
								</h2>
							</div>
							{isAdmin && hasPostPermissions && (
								<div className="flex gap-2">
									<Link
										href={`/post/${post.id}/edit`}
										className="px-3 py-1 text-sm border rounded-md shadow-md"
									>
										Redigera
									</Link>
								</div>
							)}
						</div>
						<p className="mt-3 text-gray-700 line-clamp-3 wrap-break-word">
							{post.content}
						</p>
						<div className="flex flex-row">
							<Link
								href={`/post/${post.id}`}
								aria-label={`Läs mer om ${post.title}`}
								className="w-full text-center text-sm font-semibold mt-3 border b-2 rounded-md px-3 py-1 text-(--bg-light) bg-(--accent-lightblue) shadow-md"
							>
								Läs mer
							</Link>
						</div>
					</article>
				))}
			</main>
		</div>
	);
}
