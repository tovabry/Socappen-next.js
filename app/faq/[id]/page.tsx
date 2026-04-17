import { Header } from "@/components/Header";
import { ArrowRight, Pencil } from "lucide-react";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DeleteFaqButton } from "@/components/faq/DeleteFaqButton";

interface Props {
	params: Promise<{ id: string }>;
}

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function FaqAnswerPage({ params }: Props) {
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

	const faqRes = await fetch(`http://localhost:8080/api/faq/${id}`);
	const faq = await faqRes.json();

	return (
		<div>
			<Header title="FAQ" backRouteLink="/faq" />
			<section className="flex flex-col items-center mt-10 bg-white p-6 rounded-lg shadow-md mx-10">
				<h1 className="text-xl">{faq.question}</h1>
				<hr className="my-4 w-full border-t border-gray-300" />
				<p className="text-lg">{faq.answer}</p>
				{isAdmin && (
					<div className="flex gap-4 mt-6">
						<a
							href={`/faq/${id}/edit`}
							className="flex items-center gap-2 px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
						>
							<Pencil size={16} />
							Redigera
						</a>
						<DeleteFaqButton faqId={id} />
					</div>
				)}
			</section>
			{faq.status === 500 ? (
				<section className="flex flex-col items-center mt-30">
					<p className="text-white">
						Här var det tomt...
						<a
							href="/faq"
							className="text-(--link-color-red) flex items-center"
						>
							Gå tillbaka
							<ArrowRight className="inline ml-1" />
						</a>
					</p>
				</section>
			) : null}
		</div>
	);
}
