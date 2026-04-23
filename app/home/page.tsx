import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomePageButton } from "@/components/HomePageButtons";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function HomePage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	let user = null;
	let isAdmin = false;
	let isSysAdmin = false;
	let isUser = false;

	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			user = decoded;
			isAdmin = decoded.roles.includes("ROLE_ADMIN");
			isSysAdmin = decoded.roles.includes("ROLE_SYSADMIN");
			isUser = decoded.roles.includes("ROLE_USER");
		} catch {
			console.error("Invalid token");
		}
	}
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
			<main className="flex-1 mb-4">
				<h2 className="flex items-center gap-2 text-white mx-12 my-4 text-xl font-semibold">
					Välkommen, {user?.sub ?? "Gäst"}
					{roleLabel && (
						<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">
							{roleLabel}
						</span>
					)}
				</h2>
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
						user ? "Skriv med oss" : "Logga in för att skriva till oss"
					}
					routeLink="/messages"
					disabled={!isSysAdmin && !isAdmin && !isUser}
				/>

				{isSysAdmin && (
					<HomePageButton buttonText="System admin" routeLink="/sysadmin" />
				)}
			</main>
			<Footer />
		</div>
	);
}
