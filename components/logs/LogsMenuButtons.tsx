import { ArrowRight } from "lucide-react";

interface LogsMenuButtonProps {
	buttonText: string;
	routeLink?: string;
}

export function LogsMenuButton({ buttonText, routeLink }: LogsMenuButtonProps) {
	return (
		<div className="rounded-full border shadow-md bg-(--accent-lightblue) mx-5 mt-5 hover:transform transition-transform duration-200 group hover:shadow-2xl">
			<a href={routeLink || "#"} aria-label={`Navigera till ${buttonText}`}>
				<div className="flex flex-row p-4 justify-between">
					<span className="text-white text-md">{buttonText}</span>
					<ArrowRight
						className="text-white transition-transform duration-200 group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</div>
			</a>
		</div>
	);
}
