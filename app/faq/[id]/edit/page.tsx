import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Header } from "@/components/Header";
import { updateFaq } from "../../actions";
import { DeleteFaqButton } from "@/components/faq/DeleteFaqButton";

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

	const faqRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`);
	const faq = await faqRes.json();

	return (
		<div className="w-full">
			<Header title="Redigera FAQ" backRouteLink={`/faq`} />
			<main className="mx-6 my-6 flex flex-col gap-6">
				<section className="bg-white rounded-lg shadow-md p-6">
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
				<section className="bg-white rounded-lg shadow-md p-6">
					<h2 className="text-lg font-semibold mb-2">Ta bort inlägg</h2>
					<p className="text-sm text-gray-500 mb-4">
						Åtgärden kan inte ångras.
					</p>
					<DeleteFaqButton faqId={id} />
				</section>
			</main>
		</div>
	);
}
