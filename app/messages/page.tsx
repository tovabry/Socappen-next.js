import { Header } from "@/components/Header";
import { serverFetch } from "@/lib/serverFetch";
import { sortConversationsByActivity } from "@/lib/sorting/sortConversations";
import { createConversation } from "./actions";
import { redirect } from "next/navigation";
import { getRoles } from "@/lib/getRole";
import { ConversationCard } from "@/components/messages/ConversationCard";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}
interface ResponseParticipant {
	id: number;
	userId: number;
	email: string;
	joinedAt: string;
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

	// TODO:
	// Should be removed and let /conversations/{id} endpoint return the label to avoid extra fetches like this one.
	// Get participating users email to show as label in conversation cards.
	const meRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
	);
	const me = meRes.ok ? await meRes.json() : null;

	const allVisibleConversations = [...myConversations, ...allConversations];

	const labels = isAdmin
		? new Map(
				await Promise.all(
					allVisibleConversations.map(
						async (c) =>
							[c.id, await getConversationLabel(c.id, me?.id)] as const,
					),
				),
			)
		: new Map(
				allVisibleConversations.map((c) => [c.id, "Administratör"] as const),
			);

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

					{/* Show logged in user's conversations */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{sortConversationsByActivity(myConversations).map((c) => (
							<ConversationCard
								key={c.id}
								conversation={c}
								isParticipant={myConversationIds.has(c.id)}
								participantName={labels.get(c.id) || `Konversation ${c.id}`}
							/>
						))}
					</div>
					{/* If logged in user has no conversations, show button to create a new one */}
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

				{/* If admin show all started conversations */}
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
									participantName={labels.get(c.id) || `Konversation ${c.id}`}
								/>
							))}
						</div>
					</section>
				)}
			</main>
		</div>
	);
}

// TODO:
// participants should be fetched with conversations/{id} endpoint to avoid extra fetches like this one.
async function getConversationLabel(conversationId: number, myUserId?: number) {
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations/${conversationId}/participant`,
		{ cache: "no-store" },
	);

	if (!res.ok) {
		console.error(
			`participant fetch failed for ${conversationId}:`,
			res.status,
			await res.text(),
		);
		return `Konversation ${conversationId}`;
	}

	const participants: ResponseParticipant[] = await res.json();
	const other = participants.find((p) => p.userId !== myUserId);

	return (
		other?.email ?? participants[0]?.email ?? `Konversation ${conversationId}`
	);
}
