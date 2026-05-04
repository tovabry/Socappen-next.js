import { Header } from "@/components/Header";
import { MenuButton } from "@/components/sysadmin/MenuButton";

export default function HomePage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="System Administratör" backRouteLink="/home" />
			<main className="flex flex-col w-full justify-center">
				<MenuButton buttonText="Hantera behörigheter" routeLink="#" />
				<MenuButton buttonText="Hantera konton" routeLink="/sysadmin/users" />
				<MenuButton buttonText="Systemloggar" routeLink="/sysadmin/logs" />
				<MenuButton buttonText="Systeminställningar" routeLink="#" />
			</main>
		</div>
	);
}
