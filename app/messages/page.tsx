"use client";

import { Header } from "@/components/Header";
import { getToken } from "@/lib/auth";
import { formatDate } from "@/lib/formatDate";
import { useEffect, useState } from "react";

interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
}

export default function MessagesPage() {
	const [conversations, setConversations] = useState<ResponseConversation[]>(
		[],
	);

	// fetch conversations on first load to show the list of conversations where logged in user is a participant.
	useEffect(() => {
		const token = getToken();
		fetch("http://localhost:8080/api/conversations/my?page=0&size=20", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((res) => res.json())
			.then((data: ResponseConversation[]) => setConversations(data))
			.catch((err) => {
				console.error("Failed to fetch conversations:", err);
				setConversations([]);
			});
	}, []);

	return (
		<div className="flex flex-col">
			<Header title="Konversationer" backRouteLink="/home" />
			{conversations.map((conversation) => (
				<div
					key={conversation.id}
					className="bg-white rounded-md shadow mx-5 mt-5"
				>
					<a
						href={`/messages/${conversation.id}`}
						className="block p-4 border-b"
					>
						<h3 className="text-black">Conversation {conversation.id}</h3>
						<p>{formatDate(conversation.createdAt)}</p>
						<p>Status: {conversation.status}</p>
					</a>
				</div>
			))}
		</div>
	);
}
