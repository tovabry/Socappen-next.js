import { ArrowRight } from "lucide-react";

interface HomePageButtonsProps {
	buttonText: string;
	routeLink?: string;
}

export function HomePageButton({
	buttonText,
	routeLink,
}: HomePageButtonsProps) {
	return (
		<div className="rounded-full border p-4 shadow-md bg-[#DF5E5E] mx-5 mt-5">
			<a href={routeLink || "#"} aria-label={`Navigera till ${buttonText}`}>
				<div className="flex flex-row justify-between">
					<span className="text-white text-md">{buttonText}</span>
					<ArrowRight className="text-white" aria-hidden="true" />
				</div>
			</a>
		</div>
	);
}
