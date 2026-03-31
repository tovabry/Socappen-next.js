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
			<div>
				<h1>{faq.question}</h1>
				<p>{faq.answer}</p>
			</div>
			{/* If FAQ returns 500 status show error and link back to FAQ page. */}
			{faq.status === 500 ? (
				<div className="flex flex-col items-center mt-30">
					<p className="text-white">
						Här var det tomt...
						<a href="/faq" className="text-[#DF5E5E] flex items-center">
							Gå tillbaka
							<ArrowRight className="inline ml-1" />
						</a>
					</p>
				</div>
			) : null}
		</div>
	);
}
