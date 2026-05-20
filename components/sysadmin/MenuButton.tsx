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
					<p className="text-white text-shadow-md text-md">{buttonText}</p>

					<ArrowRight
						className="text-white transition-transform duration-200 group-hover:translate-x-1"
						aria-hidden="true"
					/>
				</div>
			</a>
		</div>
	);
}
