"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SentMessage } from "@/components/messages/SentMessage";
import { RecievedMessage } from "@/components/messages/RecievedMessage";
import { useAuth } from "@/lib/context/AuthContext";
import { Send } from "lucide-react";
import { Header } from "@/components/Header";
import { useMessages } from "@/lib/hooks/useMessages";
import { MessageValidationError } from "@/lib/messages";

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

	// Refs to manage pagination and websocket state without re-renders
	const listRef = useRef<HTMLUListElement>(null);
	const topOfListRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Infinite scroll to load older messages when scrolling to top.
	// Dedupe messages based on id to avoid errors when a new messages is sent and trying to fetch older messages with matching ids
	useEffect(() => {
		const topOfList = topOfListRef.current;
		if (!topOfList) return;
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) return;
			loadOlder(listRef.current?.scrollHeight ?? 0);
		});
		observer.observe(topOfList);
		return () => observer.disconnect();
	}, [conversationId]);

	// Scroll to bottom on new messages
	// if loading more stay at the same position.
	useLayoutEffect(() => {
		if (prevScrollHeightRef.current !== null && listRef.current) {
			listRef.current.scrollTop =
				listRef.current.scrollHeight - prevScrollHeightRef.current;
			prevScrollHeightRef.current = null;
			isFetchingRef.current = false;
		} else {
			bottomRef.current?.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSend = async () => {
		try {
			if (!newMessage.trim()) return;
			await sendMessage(newMessage);
			setNewMessage("");
			if (textareaRef.current) textareaRef.current.style.height = "auto";
		} catch (err) {
			if (err instanceof MessageValidationError) setSendError(err.message);
		}
	};

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage(e.target.value);
		const el = textareaRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}
	};

	return (
		<div className="flex flex-col" style={{ height: "100dvh" }}>
			<Header title="Chatt" backRouteLink="/messages" />
			<ul ref={listRef} className="flex-1 overflow-y-auto">
				<div
					ref={topOfListRef}
					className="flex justify-center py-2 text-sm text-gray-400"
				>
					{loadingMore && "Laddar..."}
					{!hasMore && "Inga tidigare meddelanden"}
				</div>
				{messages.map((m) =>
					m.senderId === user?.id ? (
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
				<div ref={bottomRef} />
			</ul>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSend();
				}}
				className="flex flex-row p-1 py-4 w-full bg-white mx-auto"
			>
				<textarea
					ref={textareaRef}
					value={newMessage}
					onChange={handleInput}
					onFocus={() => {
						setTimeout(() => {
							bottomRef.current?.scrollIntoView({ behavior: "smooth" });
						}, 300);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
					placeholder="Skicka meddelande"
					rows={1}
					className="w-full resize-none overflow-y-auto focus:outline-none px-3 py-2 border border-gray-400 rounded-lg mx-2 shadow-sm max-h-22 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
				/>
				<button type="submit" className="mr-2 p-1" aria-label="Send message">
					<Send strokeWidth={1} />
				</button>
			</form>
			{sendError && (
				<div className="text-red-500 bg-white text-sm text-center">
					{sendError}
				</div>
			)}
		</div>
	);
}
