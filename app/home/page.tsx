"use client";

import { Header } from "@/components/Header";
import { HomePageButton } from "@/components/HomePageButtons";
import { useEffect, useState } from "react";

interface ResponseUser {
	email: string;
}

export default function HomePage() {
	const [user, setUser] = useState<string>("Guest");

	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log("Token:", token);

		fetch("http://localhost:8080/api/users/me", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data: ResponseUser) => setUser(data.email))
			.catch(() => setUser("anonymous user"));
	}, []);

	return (
		<div>
			<Header title="Resursenheten för ungdomar" />
			<h1>Welcome, {user}</h1>
			<p className="mx-10 mt-5 text-white">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias obcaecati
				similique perspiciatis ratione repellat illo est atque nisi, neque illum
				temporibus consequuntur possimus itaque molestiae numquam et totam quod
				asperiores.
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
