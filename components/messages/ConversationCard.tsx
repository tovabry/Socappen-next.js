import { joinConversation } from "@/app/messages/actions";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
	conversationCount: number;
	participantEmail: string;
}

export function ConversationCard({
	conversation,
	isParticipant,
	conversationLabel,
}: {
	conversation: ResponseConversation;
	isParticipant: boolean;
	conversationLabel: string;
}) {
	return (
		<article className="bg-white rounded-lg shadow-md p-5 overflow-hidden">
			<div className="flex justify-between items-start gap-3">
				<div className="min-w-0">
					<h3 className="text-lg font-semibold wrap-break-word">
						{conversationLabel}
					</h3>
					<time
						dateTime={conversation.lastActivityAt}
						className="text-xs text-gray-500"
					>
						Senaste aktivitet: {formatDate(conversation.lastActivityAt)}
					</time>
					<p className="text-sm text-gray-700 mt-2">
						Status: {conversation.status}
					</p>
					<p className="text-sm text-gray-700 mt-2">
						Användare med i chatten: {conversation.conversationCount}
					</p>
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{!isParticipant ? (
					<form action={joinConversation} className="w-full">
						<input
							type="hidden"
							name="conversationId"
							value={conversation.id}
						/>
						<button
							type="submit"
							aria-label={`Gå med i konversation ${conversation.id}`}
							className="w-full text-center text-sm px-3 py-2 bg-(--accent-lightblue) text-white rounded-md shadow-md"
						>
							Gå med i konversation
						</button>
					</form>
				) : (
					<Link
						href={`/messages/${conversation.id}`}
						aria-label={`Öppna konversation ${conversation.id}`}
						className="w-full text-center text-sm font-semibold mt-3 border b-2 rounded-md px-3 py-1 text-(--bg-light) bg-(--accent-lightblue) shadow-md"
					>
						Öppna
					</Link>
				)}
			</div>
		</article>
	);
}
