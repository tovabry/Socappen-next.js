import { Header } from "@/components/Header";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { createPost } from "../actions";

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
			<main className="mx-10 mt-6">
				<section className="bg-white rounded-lg shadow-md p-6">
					<form action={createPost} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<label htmlFor="title" className="text-sm font-medium">
								Titel
							</label>
							<input
								id="title"
								name="title"
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
								rows={8}
								className="p-2 border rounded-md resize-none"
								required
							/>
						</div>
						<button
							type="submit"
							className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
						>
							Publicera
						</button>
					</form>
				</section>
			</main>
		</div>
	);
}
