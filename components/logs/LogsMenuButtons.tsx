import { ArrowRight } from "lucide-react";

interface LogsMenuButtonProps {
	buttonText: string;
	routeLink?: string;
}

export function LogsMenuButton({ buttonText, routeLink }: LogsMenuButtonProps) {
	return (
		<div className="rounded-full border p-4 shadow-md bg-(--bg-secondary-color-red) mx-5 mt-5">
			<a href={routeLink || "#"} aria-label={`Navigera till ${buttonText}`}>
				<div className="flex flex-row justify-between">
					<span className="text-white text-md">{buttonText}</span>
					<ArrowRight className="text-white" aria-hidden="true" />
				</div>
			</a>
		</div>
	);
}
