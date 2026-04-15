import { Header } from "@/components/Header";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortConversationsByActivity } from "@/lib/sorting/sortConversations";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

export default async function MessagesPage() {
	const res = await serverFetch(
		"http://localhost:8080/api/conversations/my?page=0&size=20",
	);
	const conversations: ResponseConversation[] = res.ok ? await res.json() : [];
	const sortedConversations = sortConversationsByActivity(conversations);

	return (
		<div className="flex flex-col">
			<Header title="Konversationer" backRouteLink="/home" />
			{sortedConversations.map((conversation) => (
				<div
					key={conversation.id}
					className="bg-white rounded-md shadow mx-5 mt-5"
				>
					<a
						href={`/messages/${conversation.id}`}
						className="block p-4 border-b"
					>
						<h3 className="text-black">Konversation {conversation.id}</h3>
						<p>{formatDate(conversation.createdAt)}</p>
						<p>Status: {conversation.status}</p>
						<p>Senaste aktivitet: {formatDate(conversation.lastActivityAt)}</p>
					</a>
				</div>
			))}
		</div>
	);
}
