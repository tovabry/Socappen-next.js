import { Header } from "@/components/Header";
import { LogsMenuButton } from "@/components/logs/LogsMenuButtons";

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="Loggar" backRouteLink="/home" />
			<main className=" flex flex-col items-start w-full">
				<LogsMenuButton
					buttonText="Meddelande loggar"
					routeLink="/logs/messagelogs"
				/>
				<LogsMenuButton
					buttonText="Authentication loggar"
					routeLink="/logs/authlogs"
				/>
				<LogsMenuButton buttonText="FAQ loggar" routeLink="/logs/faqlogs" />
				<LogsMenuButton buttonText="Post loggar" routeLink="/logs/postlogs" />
			</main>
		</div>
	);
}
