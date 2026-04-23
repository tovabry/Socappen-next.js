import { Header } from "@/components/Header";
import { MenuButton } from "@/components/sysadmin/MenuButton";

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="Loggar" backRouteLink="/home" />
			<main className=" flex flex-col items-start w-full">
				<MenuButton buttonText="Systemloggar" routeLink="/sysadmin/logs" />
			</main>
		</div>
	);
}
