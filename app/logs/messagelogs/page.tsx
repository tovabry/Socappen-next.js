"use client";
import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";
import { useEffect, useState } from "react";

interface MessageLog {
	id: number;
	appUserId: number;
	conversationId: number;
	ipAddress: string;
	createdAt: string;
}

export default function MessageLogs() {
	const [messageLogs, setMessageLogs] = useState<MessageLog[]>([]);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const res = await fetch(
					"http://localhost:8080/api/admin/logs/messages",
					{
						credentials: "include",
					},
				);
				const data = await res.json();
				setMessageLogs(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchLogs();
	}, []);

	const sortedLogs = sortLogsByCreatedAt(messageLogs);

	return (
		<LogTable
			title="Meddelande loggar"
			data={sortedLogs}
			columns={[
				{ id: 1, header: "User ID", render: (l) => l.appUserId },
				{ id: 2, header: "Konversations ID", render: (l) => l.conversationId },
				{ id: 3, header: "IP Address", render: (l) => l.ipAddress },
				{ id: 4, header: "Skapad", render: (l) => formatDate(l.createdAt) },
			]}
		/>
	);
}
