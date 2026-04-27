import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import { sortPostsByNewest } from "@/lib/sorting/sortPosts";

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
				{isAdmin && (
					<a
						href="/post/new"
						className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm shadow-md"
					>
						+ Nytt inlägg
					</a>
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
							{isAdmin && (
								<div className="flex gap-2">
									<a
										href={`/post/${post.id}/edit`}
										className="px-3 py-1 text-sm border rounded-md shadow-md"
									>
										Redigera
									</a>
								</div>
							)}
						</div>
						<p className="mt-3 text-gray-700 line-clamp-3 wrap-break-word">
							{post.content}
						</p>
						<div className="flex flex-row">
							<a
								href={`/post/${post.id}`}
								aria-label={`Läs mer om ${post.title}`}
								className="text-sm mt-3 border rounded-2xl px-3 py-1 text-(--bg-secondary-color-red) shadow-md"
							>
								Läs mer
							</a>
						</div>
					</article>
				))}
			</main>
		</div>
	);
}
