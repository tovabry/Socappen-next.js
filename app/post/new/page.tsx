import { Header } from "@/components/Header";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { createPost } from "../actions";
import { NewPostForm } from "@/components/post/NewPostForm";

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function NewPostPage() {
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
