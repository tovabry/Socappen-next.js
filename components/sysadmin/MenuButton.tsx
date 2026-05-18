import { ArrowRight } from "lucide-react";

interface MenuButtonProps {
	buttonText: string;
	routeLink?: string;
	disabled?: boolean;
}

export function MenuButton({
	buttonText,
	routeLink,
	disabled = false,
}: MenuButtonProps) {
	return (
		<div
			className={`rounded-full border shadow-md mx-5 mt-5 ${
				disabled
					? "bg-(--bg-secondary-color-red)/50 pointer-events-none"
					: "bg-(--bg-secondary-color-red)"
			}`}
		>
			<a href={routeLink || "#"} aria-label={`Navigera till ${buttonText}`}>
				<div className="flex flex-row p-4 justify-between">
					<span className="text-white text-md">{buttonText}</span>
					<ArrowRight className="text-white" aria-hidden="true" />
				</div>
			</a>
		</div>
	);
}
