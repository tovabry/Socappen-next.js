import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomePageButton } from "@/components/HomePageButtons";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { getRoles } from "@/lib/getRole";

export default async function HomePage() {
	const { isUser, isAdmin, isSysAdmin } = await getRoles();
	const roleLabel = isSysAdmin
		? "SysAdmin"
		: isAdmin
			? "Admin"
			: isUser
				? "Användare"
				: null;

	return (
		<div className="flex flex-col min-h-screen">
			<Header title="Resursenheten för ungdomar" />
			<main className="flex-1 mb-4 md:w-2/3 lg:w-1/2 mx-auto">
				<WelcomeMessage roleLabel={roleLabel} />
				<p className="mx-12 my-5 text-white text-lg">
					Resursenheten har hand om familjefrågor. Du som ungdom kan kontakta
					oss här genom öppna frågor eller vår anonyma chatt som är öppen under
					begränsade tider. För personlig hjälp kan du kontakta oss här och
					här....
				</p>
				<HomePageButton
					buttonText="Vanligt förekommande frågor"
					routeLink="/faq"
				/>
				<HomePageButton buttonText="Posts" routeLink="/post" />
				<HomePageButton buttonText="Andra kontakter" routeLink="/contacts" />
				<HomePageButton
					buttonText={
						isUser || isAdmin || isSysAdmin
							? "Skriv med oss"
							: "Logga in för att skriva till oss"
					}
					routeLink="/messages"
					disabled={!isSysAdmin && !isAdmin && !isUser}
				/>

				{isAdmin && (
					<HomePageButton buttonText="Admin verktyg" routeLink="/sysadmin" />
				)}
			</main>
			<Footer />
		</div>
	);
}
