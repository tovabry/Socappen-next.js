"use client";

import { SentMessage } from "@/components/messages/SentMessage";
import { RecievedMessage } from "@/components/messages/RecievedMessage";
import type { Message } from "@/lib/messages";

interface Props {
	listRef: React.RefObject<HTMLUListElement | null>;
	topOfListRef: React.RefObject<HTMLDivElement | null>;
	bottomRef: React.RefObject<HTMLDivElement | null>;
	messages: Message[];
	userId?: number;
	loadingMore: boolean;
	hasMore: boolean;
}

export function MessageList({
	listRef,
	topOfListRef,
	bottomRef,
	messages,
	userId,
	loadingMore,
	hasMore,
}: Props) {
	return (
		<ul ref={listRef} className="flex-1 overflow-y-auto">
			<div
				ref={topOfListRef}
				className="flex justify-center py-2 text-sm text-gray-400"
			>
				{loadingMore && "Laddar..."}
				{!hasMore && "Inga tidigare meddelanden"}
			</div>

			{messages.map((m) => {
				const isAi = m.senderType === "AI";
				const isMine = m.senderId === userId && !isAi;

				return isMine ? (
					<SentMessage
						key={m.id}
						senderId={m.senderId}
						content={m.content}
						sentAt={m.sentAt}
					/>
				) : (
					<RecievedMessage
						key={m.id}
						senderId={m.senderId}
						content={m.content}
						sentAt={m.sentAt}
					/>
				);
			})}

			<div ref={bottomRef} />
		</ul>
	);
}
