import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomePageButton } from "@/components/HomePageButtons";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { getRoles } from "@/lib/getRole";
import {
	CircleQuestionMark,
	Contact,
	Hammer,
	MessageCircle,
	Newspaper,
} from "lucide-react";

export default async function HomePage() {
	const { isUser, isAdmin, isSysAdmin } = await getRoles();

	return (
		<div className="flex flex-col min-h-screen max-w-full">
			<Header title="Socialtjänsten" />
			<main className="flex-1 w-full mb-4 md:w-2/3 lg:w-1/2 mx-auto">
				<article className=" text-white px-6 pt-6 flex flex-row items-center">
					<img
						src="/HK_logotyp_staende_neg.png"
						alt="Herrljunga Kommun logotyp"
						className="h-20 w-20 object-contain m-10"
					/>

					<WelcomeMessage />
				</article>
				<div className="h-1 max-w-full mx-10 bg-(--accent-lightblue) rounded-full"></div>
				<p className="max-w-full mx-10 text-white text-md mt-4">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam quas
					officiis reiciendis, omnis laudantium sapiente, ratione dignissimos
					eveniet odit nisi quidem aliquid alias cum tempore sequi
					necessitatibus aut consectetur optio.
				</p>
				<HomePageButton
					buttonText="Vanligt förekommande frågor"
					routeLink="/faq"
					icon={
						<CircleQuestionMark
							className="text-white"
							aria-hidden="true"
							size={24}
						/>
					}
				/>
				<HomePageButton
					buttonText="Posts"
					routeLink="/post"
					icon={
						<Newspaper className="text-white" aria-hidden="true" size={24} />
					}
				/>
				<HomePageButton
					buttonText="Andra kontakter"
					routeLink="/contacts"
					icon={<Contact className="text-white" aria-hidden="true" size={24} />}
				/>
				<HomePageButton
					buttonText={
						isUser || isAdmin || isSysAdmin
							? "Skriv med oss"
							: "Logga in för att skriva till oss"
					}
					routeLink="/messages"
					disabled={!isSysAdmin && !isAdmin && !isUser}
					icon={
						<MessageCircle
							className="text-white"
							aria-hidden="true"
							size={24}
						/>
					}
				/>

				{isAdmin && (
					<HomePageButton
						buttonText="Admin verktyg"
						routeLink="/sysadmin"
						icon={
							<Hammer className="text-white" aria-hidden="true" size={24} />
						}
					/>
				)}
			</main>
			<Footer />
		</div>
	);
}
