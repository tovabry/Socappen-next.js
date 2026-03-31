import { Header } from "@/components/Header";

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
			<h1>{faq.question}</h1>
			<p>{faq.answer}</p>
		</div>
	);
}
