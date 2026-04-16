import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function FaqNewPage() {
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

	if (!isAdmin) redirect("/faq");

	async function createFaq(formData: FormData) {
		"use server";
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		const currentUserRes = await fetch("http://localhost:8080/api/users/me", {
			headers: { Cookie: `token=${token}` },
		});
		const currentUser = await currentUserRes.json();

		const res = await fetch("http://localhost:8080/api/faq", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: `token=${token}`,
			},
			body: JSON.stringify({
				userId: currentUser.id,
				question: formData.get("question"),
				Answer: formData.get("answer"),
			}),
		});
		if (!res.ok) {
			console.error("Create failed:", res.status, await res.text());
			return;
		}
		redirect("/faq");
	}

	return (
		<div className="w-full">
			<Header title="Ny FAQ" backRouteLink="/faq" />
			<section className="flex flex-col mt-10 bg-white p-6 rounded-lg shadow-md mx-10 gap-4">
				<form action={createFaq} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Fråga</label>
						<input name="question" className="p-2 border rounded-md" required />
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Svar</label>
						<textarea
							name="answer"
							rows={5}
							className="p-2 border rounded-md resize-none"
							required
						/>
					</div>
					<button
						type="submit"
						className="self-end px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
					>
						Skapa
					</button>
				</form>
			</section>
		</div>
	);
}
