import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortConversationsByActivity } from "@/lib/sorting/sortConversations";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { createConversation } from "./actions";

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

	const myRes = await serverFetch(
		"http://localhost:8080/api/conversations/my?page=0&size=20",
	);
	const myConversations: ResponseConversation[] = myRes.ok
		? await myRes.json()
		: [];

	let allConversations: ResponseConversation[] = [];
	if (isAdmin) {
		const allRes = await serverFetch(
			"http://localhost:8080/api/conversations?page=0&size=100",
		);
		allConversations = allRes.ok ? await allRes.json() : [];
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
						<ConversationCard key={c.id} conversation={c} />
					))}
					<h2 className="text-xl text-center font-semibold mt-10 mx-5">
						Alla konversationer
					</h2>
					{sortConversationsByActivity(allConversations).map((c) => (
						<ConversationCard key={c.id} conversation={c} />
					))}
				</>
			) : (
				<>
					<h2 className="text-xl font-semibold text-center mt-5 mx-5">
						Mina konversationer
					</h2>
					{sortConversationsByActivity(myConversations).map((c) => (
						<ConversationCard key={c.id} conversation={c} />
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
}: {
	conversation: ResponseConversation;
}) {
	return (
		<div className="bg-white rounded-md shadow mx-5 mt-5">
			<a href={`/messages/${conversation.id}`} className="block p-4 border-b">
				<h3 className="text-black">Konversation {conversation.id}</h3>
				<p>{formatDate(conversation.createdAt)}</p>
				<p>Status: {conversation.status}</p>
				<p>Senaste aktivitet: {formatDate(conversation.lastActivityAt)}</p>
			</a>
		</div>
	);
}
