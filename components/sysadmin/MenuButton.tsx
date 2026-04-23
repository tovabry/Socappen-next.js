import { ArrowRight } from "lucide-react";

interface MenuButtonProps {
	buttonText: string;
	routeLink?: string;
}

export function MenuButton({ buttonText, routeLink }: MenuButtonProps) {
	return (
		<div className="rounded-full border shadow-md bg-(--bg-secondary-color-red) mx-5 mt-5">
			<a href={routeLink || "#"} aria-label={`Navigera till ${buttonText}`}>
				<div className="flex flex-row p-4 justify-between">
					<span className="text-white text-md">{buttonText}</span>
					<ArrowRight className="text-white" aria-hidden="true" />
				</div>
			</a>
		</div>
	);
}
