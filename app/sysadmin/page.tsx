import { Header } from "@/components/Header";
import { MenuButton } from "@/components/sysadmin/MenuButton";
import { hasPermission } from "@/lib/getPermissions";

export default async function HomePage() {
	const hasUserPermissions = await hasPermission("manage_user");
	const hasLogViewPermissions = await hasPermission("view_logs");
	return (
		<div className="flex flex-col min-h-screen">
			<Header title="System Administratör" backRouteLink="/home" />
			<main className="flex-1 my-4 md:w-2/3 lg:w-1/2 mx-auto">
				<MenuButton
					buttonText="Hantera konton"
					routeLink="/sysadmin/users"
					disabled={!hasUserPermissions}
				/>
				<MenuButton
					buttonText="Systemloggar"
					routeLink="/sysadmin/logs"
					disabled={!hasLogViewPermissions}
				/>
			</main>
		</div>
	);
}
