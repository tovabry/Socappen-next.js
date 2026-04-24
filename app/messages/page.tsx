import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortConversationsByActivity } from "@/lib/sorting/sortConversations";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { createConversation, joinConversation } from "./actions";
import { fetchCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

type JwtPayload = { roles: string[]; sub: string; exp: number };

export default async function MessagesPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	let isAdmin = false;
	let isUser = false;

	if (token) {
		try {
			const decoded = jwtDecode<JwtPayload>(token);
			isAdmin = decoded.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			);
			isUser = decoded.roles.includes("ROLE_USER");
		} catch {
			console.error("Invalid token");
		}
	}

	if (!isAdmin && !isUser) {
		redirect("/home");
	}

	// Get conversations where logged in user is a participant
	const myRes = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/conversations/my?page=0&size=20`,
	);
	const myConversations: ResponseConversation[] = myRes.ok
		? await myRes.json()
		: [];

	const myConversationIds = new Set(myConversations.map((c) => c.id));

	let allConversations: ResponseConversation[] = [];

	// If admin fetch all conversations
	if (isAdmin) {
		const allRes = await serverFetch(
			`${process.env.NEXT_PUBLIC_API_URL}/conversations?page=0&size=100`,
		);
		allConversations = allRes.ok ? await allRes.json() : [];
		allConversations = allConversations.filter(
			(c: ResponseConversation) => !myConversationIds.has(c.id),
		);
	}

	return (
		<div className="flex flex-col">
			<Header title="Meddelanden" backRouteLink="/home" />
			{isAdmin ? (
				<>
					<h2 className="text-xl text-center font-semibold mt-5 mx-5">
						Mina konversationer
					</h2>
					{sortConversationsByActivity(myConversations).map((c) => (
						<ConversationCard
							key={c.id}
							conversation={c}
							isParticipant={myConversationIds.has(c.id)}
						/>
					))}
					<h2 className="text-xl text-center font-semibold mt-10 mx-5">
						Alla konversationer
					</h2>
					{sortConversationsByActivity(allConversations).map((c) => (
						<ConversationCard
							key={c.id}
							conversation={c}
							isParticipant={myConversationIds.has(c.id)}
						/>
					))}
				</>
			) : (
				<>
					<h2 className="text-xl font-semibold text-center mt-5 mx-5">
						Mina konversationer
					</h2>
					{sortConversationsByActivity(myConversations).map((c) => (
						<ConversationCard
							key={c.id}
							conversation={c}
							isParticipant={myConversationIds.has(c.id)}
						/>
					))}
					{isUser && myConversations.length === 0 && (
						<div className="flex justify-center mt-10">
							<form action={createConversation}>
								<button
									type="submit"
									className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md"
								>
									Starta ny chatt
								</button>
							</form>
						</div>
					)}
				</>
			)}
		</div>
	);
}

function ConversationCard({
	conversation,
	isParticipant,
}: {
	conversation: ResponseConversation;
	isParticipant: boolean;
}) {
	return (
		<div className="bg-white rounded-md shadow mx-5 mt-5">
			<a href={`/messages/${conversation.id}`} className="block p-4 border-b">
				<h3 className="text-black">Konversation {conversation.id}</h3>
				<p>{formatDate(conversation.createdAt)}</p>
				<p>Status: {conversation.status}</p>
				<p>Senaste aktivitet: {formatDate(conversation.lastActivityAt)}</p>
			</a>
			{!isParticipant && (
				<form action={joinConversation} className="p-4">
					<input type="hidden" name="conversationId" value={conversation.id} />
					<button
						type="submit"
						className="px-3 py-1 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
					>
						Gå med i konversation
					</button>
				</form>
			)}
		</div>
	);
}
