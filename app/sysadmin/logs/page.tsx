import { Header } from "@/components/Header";
import { LogsMenuButton } from "@/components/logs/LogsMenuButtons";

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="Loggar" backRouteLink="/sysadmin" />
			<main className=" flex flex-col items-start w-full">
				<LogsMenuButton
					buttonText="Meddelande loggar"
					routeLink="/sysadmin/logs/messagelogs"
				/>
				<LogsMenuButton
					buttonText="Authentication loggar"
					routeLink="/sysadmin/logs/authlogs"
				/>
				<LogsMenuButton
					buttonText="FAQ loggar"
					routeLink="/sysadmin/logs/faqlogs"
				/>
				<LogsMenuButton
					buttonText="Post loggar"
					routeLink="/sysadmin/logs/postlogs"
				/>
			</main>
		</div>
	);
}
