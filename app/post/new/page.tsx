import { Header } from "@/components/Header";
import { redirect } from "next/navigation";
import { NewPostForm } from "@/components/post/NewPostForm";
import { getRoles } from "@/lib/getRole";

export default async function NewPostPage() {
	const { isAdmin } = await getRoles();

	if (!isAdmin) redirect("/post");

	return (
		<div className="w-full">
			<Header title="Nytt inlägg" backRouteLink="/post" />
			<main className="mx-6 mt-6">
				<section className="bg-white rounded-lg shadow-md p-6">
					<NewPostForm />
				</section>
			</main>
		</div>
	);
}
