import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";

interface Props {
	params: Promise<{ id: string }>;
}

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function FaqEditPage({ params }: Props) {
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

	if (!isAdmin) redirect("/faq");

	const faqRes = await fetch(`http://localhost:8080/api/faq/${id}`);
	const faq = await faqRes.json();

	async function updateFaq(formData: FormData) {
		"use server";
		const faqId = formData.get("faqId") as string;
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		const currentUserRes = await fetch("http://localhost:8080/api/users/me", {
			headers: { Cookie: `token=${token}` },
		});
		const currentUser = await currentUserRes.json();

		const res = await fetch(`http://localhost:8080/api/faq/${faqId}`, {
			method: "PUT",
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
			console.error("Update failed:", res.status, await res.text());
			return;
		}
		redirect(`/faq/${faqId}`);
	}

	return (
		<div className="w-full">
			<Header title="Redigera FAQ" backRouteLink={`/faq/${id}`} />
			<section className="flex flex-col mt-10 bg-white p-6 rounded-lg shadow-md mx-10 gap-4">
				<form action={updateFaq} className="flex flex-col gap-4">
					<input type="hidden" name="faqId" value={id} />
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Fråga</label>
						<input
							name="question"
							defaultValue={faq.question}
							className="p-2 border rounded-md"
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Svar</label>
						<textarea
							name="answer"
							defaultValue={faq.answer}
							rows={5}
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
		</div>
	);
}
