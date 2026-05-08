"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/context/AuthContext";
import { useMessages } from "@/lib/hooks/useMessages";
import { MessageValidationError } from "@/lib/messages";
import { MessageList } from "@/components/messages/MessageList";
import { MessageComposer } from "@/components/messages/MessageComposer";

export default function MessagesClient({
	conversationId,
}: {
	conversationId: string;
}) {
	const { user } = useAuth();
	const {
		messages,
		hasMore,
		loadingMore,
		sendMessage,
		prevScrollHeightRef,
		isFetchingRef,
		loadOlder,
	} = useMessages(conversationId);

	const [newMessage, setNewMessage] = useState("");
	const [sendError, setSendError] = useState<string | null>(null);
	const [isWaitingForAi, setIsWaitingForAi] = useState(false);

	const listRef = useRef<HTMLUListElement>(null);
	const topOfListRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const topOfList = topOfListRef.current;
		if (!topOfList) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			loadOlder(listRef.current?.scrollHeight ?? 0);
		});

		observer.observe(topOfList);
		return () => observer.disconnect();
	}, [conversationId, loadOlder]);

	useLayoutEffect(() => {
		if (prevScrollHeightRef.current !== null && listRef.current) {
			listRef.current.scrollTop =
				listRef.current.scrollHeight - prevScrollHeightRef.current;
			prevScrollHeightRef.current = null;
			isFetchingRef.current = false;
		} else {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages, prevScrollHeightRef, isFetchingRef]);

	const handleSend = async () => {
		const content = newMessage.trim();
		if (!content) return;

		setNewMessage("");
		setSendError(null);
		if (textareaRef.current) textareaRef.current.style.height = "auto";

		setIsWaitingForAi(true);
		try {
			await sendMessage(content);
		} catch (err) {
			if (err instanceof MessageValidationError) setSendError(err.message);
		} finally {
			setIsWaitingForAi(false);
		}
	};

	return (
		<div className="flex flex-col" style={{ height: "100dvh" }}>
			<Header title="Chatt" backRouteLink="/messages" />

			<MessageList
				listRef={listRef}
				topOfListRef={topOfListRef}
				bottomRef={bottomRef}
				messages={messages}
				userId={user?.id}
				loadingMore={loadingMore}
				hasMore={hasMore}
			/>

			<MessageComposer
				value={newMessage}
				onChange={setNewMessage}
				onSend={handleSend}
				textareaRef={textareaRef}
				bottomRef={bottomRef}
				error={sendError}
				isLoading={isWaitingForAi}
			/>
		</div>
	);
}
