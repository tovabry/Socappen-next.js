"use client";

import { Header } from "@/components/Header";
import { getToken } from "@/lib/auth";
import { useEffect, useState } from "react";

interface ResponseConversation {
	id: number;
}

export default function MessagesPage() {
	const [conversations, setConversations] = useState<ResponseConversation[]>(
		[],
	);

	/*
	 Fetch conversations on first load to show the list of conversations.
	(Future improvement: Only show conversations the current logged in user is part of.)
	*/
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
					</a>
				</div>
			))}
		</div>
	);
}
