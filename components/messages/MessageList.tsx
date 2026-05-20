"use client";

import { SentMessage } from "@/components/messages/SentMessage";
import { RecievedMessage } from "@/components/messages/RecievedMessage";
import type { Message } from "@/lib/messages";

interface Props {
	listRef: React.RefObject<HTMLUListElement | null>;
	topOfListRef: React.RefObject<HTMLLIElement | null>;
	bottomRef: React.RefObject<HTMLLIElement | null>;
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
			<li
				ref={topOfListRef}
				className="flex justify-center py-2 text-sm text-gray-400 list-none"
			>
				{loadingMore && "Laddar..."}
				{!hasMore && "Inga tidigare meddelanden"}
			</li>

			{messages.map((m) =>
				m.senderId === userId ? (
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
				),
			)}

			<li ref={bottomRef} className="list-none" />
		</ul>
	);
}
