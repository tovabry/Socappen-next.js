import { Header } from "@/components/Header";
import { ArrowRight } from "lucide-react";

interface Props {
	params: Promise<{ id: string }>;
}

export default async function FaqAnswerPage({ params }: Props) {
	const { id } = await params;
	const res = await fetch(`http://localhost:8080/api/faq/${id}`);
	const faq = await res.json();

	return (
		<div>
			<Header title="FAQ Answer" backRouteLink="/faq" />
			{/* Main content */}
			<section className="flex flex-col items-center mt-10 bg-white p-6 rounded-lg shadow-md mx-10">
				<h1 className="text-xl">{faq.question}</h1>
				<hr className="my-4 w-full border-t border-gray-300" />
				<p className="text-lg">{faq.answer}</p>
			</section>

			{/* If FAQ returns 500 status show error and link back to FAQ page. */}
			{faq.status === 500 ? (
				<section className="flex flex-col items-center mt-30">
					<p className="text-white">
						Här var det tomt...
						<a href="/faq" className="text-[#DF5E5E] flex items-center">
							Gå tillbaka
							<ArrowRight className="inline ml-1" />
						</a>
					</p>
				</section>
			) : null}
		</div>
	);
}
