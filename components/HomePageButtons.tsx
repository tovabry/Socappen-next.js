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
			<a href={routeLink || "#"}>
				<div className="flex flex-row justify-between">
					<h3 className="text-white text-md">{buttonText}</h3>
					<ArrowRight className="text-white" />
				</div>
			</a>
		</div>
	);
}
