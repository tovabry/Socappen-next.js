"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/lib/auth";
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

	// Initial load of messages and setup of websocket connection
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

	// WebSocket connection
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

	// Load older messages with infinite scroll
	const loadOlder = (listScrollHeight: number) => {
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
			.finally(() => setLoadingMore(false));
	};

	const sendMessage = (content: string) => {
		return postMessage(conversationId, content);
	};

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
