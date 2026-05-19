import { ArrowRight, MessageCircle } from "lucide-react";

interface HomePageButtonsProps {
	buttonText: string;
	routeLink?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
}

export function HomePageButton({
	buttonText,
	routeLink,
	disabled = false,
	icon,
}: HomePageButtonsProps) {
	return (
		<div
			className={`rounded-md shadow-md mx-5 mt-5 hover:shadow-2xl ${
				disabled
					? "bg-(--accent-lightblue)/50 pointer-events-none"
					: "bg-(--accent-lightblue)/70 cursor-pointer"
			}`}
		>
			<a
				href={disabled ? undefined : routeLink || "#"}
				aria-label={`Navigera till ${buttonText}`}
			>
				<div className="flex flex-row p-4 justify-between hover:transform transition-transform duration-200 group">
					<div className="flex flex-row gap-2">
						{icon}

						<p className="text-white text-shadow-md text-md">{buttonText}</p>
					</div>
					<ArrowRight
						className="text-white transition-transform duration-200 group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</div>
			</a>
		</div>
	);
}
