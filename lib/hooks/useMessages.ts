"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {
	fetchMessagePage,
	mergeOlderMessages,
	postMessage,
	pageSize,
	Message,
} from "@/lib/messages";

export function useMessages(conversationId: string) {
	const [messages, setMessages] = useState<Message[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);

	const pageRef = useRef(0);
	const hasMoreRef = useRef(true);
	const isFetchingRef = useRef(false);
	const prevScrollHeightRef = useRef<number | null>(null);
	const aiSessionIdRef = useRef<string | null>(null);

	// Initial load of messages for the current conversation
	useEffect(() => {
		const controller = new AbortController();
		isFetchingRef.current = true;
		fetchMessagePage(conversationId, 0, controller.signal)
			.then((data) => {
				if (data.length < pageSize) {
					hasMoreRef.current = false;
					setHasMore(false);
				}
				setMessages(data);
			})
			.catch((err) => {
				if (err.name !== "AbortError") console.error(err);
			})
			.finally(() => {
				isFetchingRef.current = false;
			});
		return () => controller.abort();
	}, [conversationId]);

	// Open websocket for this conversation and append incoming messages
	useEffect(() => {
		const client = new Client({
			webSocketFactory: () =>
				new SockJS(`${process.env.NEXT_PUBLIC_SOCKET_URL}/ws`),
			reconnectDelay: 5000,
		});
		client.onConnect = () => {
			client.subscribe(`/conversation/${conversationId}`, (msg) => {
				setMessages((prev) => [...prev, JSON.parse(msg.body)]);
			});
		};
		client.activate();
		// Close websocket subscription on unmount / conversation change
		return () => {
			client.deactivate();
		};
	}, [conversationId]);

	// Load older messages when user scrolls to top
	// useCallback keeps function stable between renders
	const loadOlder = useCallback(
		(listScrollHeight: number) => {
			if (isFetchingRef.current || !hasMoreRef.current) return;

			isFetchingRef.current = true;
			setLoadingMore(true);
			prevScrollHeightRef.current = listScrollHeight;

			fetchMessagePage(conversationId, pageRef.current + 1)
				.then((older) => {
					if (older.length < pageSize) {
						hasMoreRef.current = false;
						setHasMore(false);
					}
					setMessages((prev) => mergeOlderMessages(older, prev));
					pageRef.current += 1;
				})
				.catch(console.error)
				// Always release loading lock, even on error
				.finally(() => {
					setLoadingMore(false);
					isFetchingRef.current = false;
				});
		},
		[conversationId],
	);

	// Reset AI session when switching conversation.
	// refresh/new tab also starts a new AI session.
	useEffect(() => {
		aiSessionIdRef.current = null;
	}, [conversationId]);

	// Send message to current conversation
	// useCallback keeps function stable for consumers
	const sendMessage = useCallback(
		async (content: string) => {
			await postMessage(conversationId, content);

			if (process.env.NEXT_PUBLIC_CHAT_MODE !== "ai") return;

			const res = await fetch("/api/ai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: content,
					sessionId: aiSessionIdRef.current,
				}),
			});

			if (!res.ok) {
				setMessages((prev) => [
					...prev,
					{
						id: Date.now() + Math.floor(Math.random() * 1000),
						senderId: -1,
						content: "AI-svar kunde inte hämtas just nu.",
						sentAt: new Date().toISOString(),
						senderType: "AI",
					},
				]);
				return;
			}

			const data = await res.json();

			if (data.session_id) {
				aiSessionIdRef.current = data.session_id;
			}

			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + Math.floor(Math.random() * 1000),
					senderId: -1,
					content: data.reply ?? "Inget svar från AI.",
					sentAt: new Date().toISOString(),
					senderType: "AI",
				},
			]);
		},
		[conversationId],
	);

	return {
		messages,
		hasMore,
		loadingMore,
		sendMessage,
		prevScrollHeightRef,
		isFetchingRef,
		loadOlder,
	};
}
