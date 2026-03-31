import { ArrowRight } from "lucide-react";

interface FaqCardProps {
	question: string;
	routeLink?: string;
}

export function QuestionCard({ question, routeLink }: FaqCardProps) {
	return (
		<div className="flex flex-col gap-2 rounded-lg border p-4 shadow-md bg-white ml-10 mr-10 mt-5">
			<a href={routeLink || "#"}>
				<div className="flex flex-row justify-between">
					<h3>{question}</h3>
					<ArrowRight />
				</div>
			</a>
		</div>
	);
}
