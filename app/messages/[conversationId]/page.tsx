"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/lib/auth";
import { useParams } from "next/navigation";
import { SentMessage } from "@/components/messages/SentMessage";
import { RecievedMessage } from "@/components/messages/RecievedMessage";
import { useAuth } from "@/lib/context/AuthContext";
import { Send } from "lucide-react";
import { Header } from "@/components/Header";

const pageSize = 20;

interface ResponseMessage {
	id: number;
	senderId: number;
	content: string;
	sentAt: string;
}

export default function MessagesPage() {
	const { conversationId } = useParams<{ conversationId: string }>();
	const { user } = useAuth();

	const [messages, setMessages] = useState<ResponseMessage[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	// Refs to manage pagination and websocket state without re-renders
	const pageRef = useRef(0);
	const hasMoreRef = useRef(true);
	const isFetchingRef = useRef(false);
	const prevScrollHeightRef = useRef<number | null>(null);
	const listRef = useRef<HTMLUListElement>(null);
	const topOfListRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Fetch messages for the conversation with pagination
	const fetchMessages = async (pageNumber: number, signal?: AbortSignal) => {
		const token = getToken();
		const res = await fetch(
			`http://localhost:8080/api/conversations/${conversationId}/messages?page=${pageNumber}&size=${pageSize}`,
			{ headers: { Authorization: `Bearer ${token}` }, signal },
		);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		if (data.length < pageSize) {
			hasMoreRef.current = false;
			setHasMore(false);
		}
		return (data as ResponseMessage[]).reverse();
	};

	// Initial load — set isFetchingRef directly to avoid race condition with infinite scroll useEffect
	useEffect(() => {
		const controller = new AbortController();
		isFetchingRef.current = true;
		fetchMessages(0, controller.signal)
			.then((data) => setMessages(data))
			.catch((err) => {
				if (err.name !== "AbortError") console.error(err);
			})
			.finally(() => {
				isFetchingRef.current = false;
			});
		return () => controller.abort();
	}, [conversationId]);

	// Infinite scroll to load older messages when scrolling to top.
	// Dedupe messages based on id to avoid errors when a new messages is sent and trying to fetch older messages with matching ids
	useEffect(() => {
		const topOfList = topOfListRef.current;
		if (!topOfList) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting || isFetchingRef.current || !hasMoreRef.current)
				return;

			isFetchingRef.current = true;
			setLoadingMore(true);
			prevScrollHeightRef.current = listRef.current?.scrollHeight ?? 0;

			fetchMessages(pageRef.current + 1)
				.then((older) => {
					setMessages((prev) => {
						const existingIds = new Set(prev.map((m) => m.id));
						const unique = older.filter((m) => !existingIds.has(m.id));
						return [...unique, ...prev];
					});
					pageRef.current += 1;
				})
				.catch(console.error)
				.finally(() => setLoadingMore(false));
		});

		observer.observe(topOfList);
		return () => observer.disconnect();
	}, [conversationId]);

	// WebSocket connection for new messages
	useEffect(() => {
		const token = getToken();
		const client = new Client({
			webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
			reconnectDelay: 5000,
			connectHeaders: { Authorization: `Bearer ${token}` },
		});
		client.onConnect = () => {
			client.subscribe(`/conversation/${conversationId}`, (msg) => {
				setMessages((prev) => [...prev, JSON.parse(msg.body)]);
			});
		};
		client.activate();
		return () => {
			client.deactivate();
		};
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

	// Send a new message to backend
	const sendMessage = () => {
		if (!newMessage.trim()) return;
		const token = getToken();
		fetch(
			`http://localhost:8080/api/conversations/${conversationId}/messages`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ content: newMessage }),
			},
		)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
			})
			.then(() => {
				setNewMessage("");
				if (textareaRef.current) textareaRef.current.style.height = "auto";
			})
			.catch(console.error);
	};

	// Handle textarea input and auto-resize height based on content inside
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
					sendMessage();
				}}
				className="flex flex-row p-1 py-4 w-full bg-white mx-auto"
			>
				<textarea
					ref={textareaRef}
					value={newMessage}
					onChange={handleInput}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					placeholder="Skicka meddelande"
					rows={1}
					className="w-full resize-none overflow-hidden focus:outline-none px-3 py-2 border border-gray-400 rounded-lg mx-2 shadow-sm"
				/>
				<button type="submit" className="mr-2 p-1">
					<Send strokeWidth={1} />
				</button>
			</form>
		</div>
	);
}
