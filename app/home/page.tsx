"use client";
import { Header } from "@/components/Header";
import { HomePageButton } from "@/components/HomePageButtons";
import { useAuth } from "@/lib/context/AuthContext";

export default function HomePage() {
	const { user } = useAuth();

	return (
		<div>
			<Header title="Resursenheten för ungdomar" />
			<h2>
				Welcome, {user?.email ?? "Guest"}, {user?.id}
			</h2>
			<p className="mx-12 my-5 text-white text-lg">
				Resursenheten har hand om familjefrågor. Du som ungdom kan kontakta oss
				här genom öppna frågor eller vår anonyma chatt som är öppen under
				begränsade tider. För personlig hjälp kan du kontakta oss här och
				här....
			</p>
			<HomePageButton buttonText="Kontakta oss" routeLink="#" />
			<HomePageButton buttonText="Andra kontakter" routeLink="/contacts" />
			<HomePageButton buttonText="Skriv med oss" routeLink="#" />
			<HomePageButton
				buttonText="Vanligt förekommande frågor"
				routeLink="/faq"
			/>
		</div>
	);
}
