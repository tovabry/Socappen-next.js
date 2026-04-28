import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortConversationsByActivity } from "@/lib/sorting/sortConversations";
import { createConversation, joinConversation } from "./actions";
import { redirect } from "next/navigation";
import { getRoles } from "@/lib/getRole";
import { ConversationCard } from "@/components/messages/ConversationCard";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

export default async function MessagesPage() {
	const { isAdmin, isUser } = await getRoles();

	if (!isAdmin && !isUser) {
		redirect("/home");
	}

	const myRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations/my?page=0&size=20`,
	);
	const myConversations: ResponseConversation[] = myRes.ok
		? await myRes.json()
		: [];

	const myConversationIds = new Set(myConversations.map((c) => c.id));
	let allConversations: ResponseConversation[] = [];

	if (isAdmin) {
		const allRes = await serverFetch(
			`${process.env.NEXT_PUBLIC_API_URL}/conversations?page=0&size=100`,
		);
		allConversations = allRes.ok ? await allRes.json() : [];
		allConversations = allConversations.filter(
			(c) => !myConversationIds.has(c.id),
		);
	}

	return (
		<div className="w-full">
			<Header title="Meddelanden" backRouteLink="/home" />

			<main className="mx-6 mt-4 space-y-10" aria-label="Konversationer">
				<section aria-labelledby="my-conversations-heading">
					<h2
						id="my-conversations-heading"
						className="text-xl text-white text-center font-semibold mb-4"
					>
						Mina konversationer
					</h2>

					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{sortConversationsByActivity(myConversations).map((c) => (
							<ConversationCard
								key={c.id}
								conversation={c}
								isParticipant={myConversationIds.has(c.id)}
							/>
						))}
					</div>

					{isUser && myConversations.length === 0 && (
						<div className="flex justify-center mt-8">
							<form action={createConversation}>
								<button
									type="submit"
									aria-label="Starta ny chatt"
									className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md"
								>
									Starta ny chatt
								</button>
							</form>
						</div>
					)}
				</section>

				{isAdmin && (
					<section aria-labelledby="all-conversations-heading">
						<h2
							id="all-conversations-heading"
							className="text-xl text-white text-center font-semibold mb-4"
						>
							Alla konversationer
						</h2>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{sortConversationsByActivity(allConversations).map((c) => (
								<ConversationCard
									key={c.id}
									conversation={c}
									isParticipant={myConversationIds.has(c.id)}
								/>
							))}
						</div>
					</section>
				)}
			</main>
		</div>
	);
}
