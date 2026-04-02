import { ArrowRight } from "lucide-react";

interface FaqCardProps {
	question: string;
	routeLink?: string;
}

export function QuestionCard({ question, routeLink }: FaqCardProps) {
	return (
		<article className="flex flex-col gap-2 rounded-lg border p-4 shadow-md bg-white mt-5">
			<a href={routeLink || "#"} aria-label={`Visa svar för ${question}`}>
				<div className="flex flex-row justify-between">
					<h3>{question}</h3>
					<ArrowRight aria-hidden="true" />
				</div>
			</a>
		</article>
	);
}
