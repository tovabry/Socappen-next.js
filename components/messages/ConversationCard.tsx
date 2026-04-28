import { joinConversation } from "@/app/messages/actions";
import { formatDate } from "@/lib/formatDate";
import Link from "next/link";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

export function ConversationCard({
	conversation,
	isParticipant,
}: {
	conversation: ResponseConversation;
	isParticipant: boolean;
}) {
	return (
		<article className="bg-white rounded-lg shadow-md p-5 overflow-hidden">
			<div className="flex justify-between items-start gap-3">
				<div className="min-w-0">
					<h3 className="text-lg font-semibold wrap-break-word">
						Konversation {conversation.id}
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
				</div>
			</div>

			<div className="mt-4 flex flex-wrap gap-2">
				{!isParticipant ? (
					<form action={joinConversation}>
						<input
							type="hidden"
							name="conversationId"
							value={conversation.id}
						/>
						<button
							type="submit"
							aria-label={`Gå med i konversation ${conversation.id}`}
							className="px-3 py-1 bg-(--bg-secondary-color-red) text-white rounded-md text-sm"
						>
							Gå med i konversation
						</button>
					</form>
				) : (
					<Link
						href={`/messages/${conversation.id}`}
						aria-label={`Öppna konversation ${conversation.id}`}
						className="text-sm border rounded-2xl px-3 py-1 text-(--bg-secondary-color-red) shadow-md"
					>
						Öppna
					</Link>
				)}
			</div>
		</article>
	);
}
