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
	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			user = decoded;
			isAdmin = decoded.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			);
		} catch {
			console.error("Invalid token");
		}
	}

	return (
		<div className="flex flex-col min-h-screen">
			<Header title="Resursenheten för ungdomar" />
			<main className="flex-1 mb-4">
				<h2>
					Welcome, {user?.sub ?? "Guest"}, {user?.sub && isAdmin && "(Admin)"}
				</h2>
				<p className="mx-12 my-5 text-white text-lg">
					Resursenheten har hand om familjefrågor. Du som ungdom kan kontakta
					oss här genom öppna frågor eller vår anonyma chatt som är öppen under
					begränsade tider. För personlig hjälp kan du kontakta oss här och
					här....
				</p>
				<HomePageButton buttonText="Posts" routeLink="/post" />
				<HomePageButton buttonText="Andra kontakter" routeLink="/contacts" />
				<HomePageButton buttonText="Skriv med oss" routeLink="/messages" />
				<HomePageButton
					buttonText="Vanligt förekommande frågor"
					routeLink="/faq"
				/>
				{isAdmin && <HomePageButton buttonText="Loggar" routeLink="/logs" />}
			</main>
			<Footer />
		</div>
	);
}
