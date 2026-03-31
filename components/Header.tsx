import { ArrowLeft } from "lucide-react";

interface HeaderProps {
	title: string;
	backRouteLink?: string;
}

export function Header({ title, backRouteLink }: HeaderProps) {
	return (
		<header className="bg-[#DF5E5E] shadow-md p-2 opacity-95">
			<div className="flex flex-row items-center px-4 py-1">
				<a href={backRouteLink || "/home"}>
					<ArrowLeft className="text-white" />
				</a>
				<h1 className="text-xl text-center text-white flex justify-around items-center w-full">
					{title}
				</h1>
			</div>
		</header>
	);
}
