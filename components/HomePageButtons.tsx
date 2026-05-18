import { ArrowRight } from "lucide-react";

interface HomePageButtonsProps {
	buttonText: string;
	routeLink?: string;
	disabled?: boolean;
}

export function HomePageButton({
	buttonText,
	routeLink,
	disabled = false,
}: HomePageButtonsProps) {
	return (
		<div
			className={`rounded-full border shadow-md mx-5 mt-5 ${
				disabled
					? "bg-(--bg-secondary-color-red)/50 pointer-events-none"
					: "bg-(--bg-secondary-color-red)"
			}`}
		>
			<a
				href={disabled ? undefined : routeLink || "#"}
				aria-label={`Navigera till ${buttonText}`}
			>
				<div className="flex flex-row p-4 justify-between">
					<p className="text-white text-shadow-md text-md">{buttonText}</p>
					<ArrowRight className="text-white" aria-hidden="true" />
				</div>
			</a>
		</div>
	);
}
