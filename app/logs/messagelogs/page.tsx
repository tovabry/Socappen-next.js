"use client";
import { LogTable } from "@/components/logs/LogTable";
import { getToken } from "@/lib/auth";
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
		const token = getToken();
		if (!token) return;

		const fetchLogs = async () => {
			try {
				const res = await fetch(
					"http://localhost:8080/api/admin/logs/messages",
					{
						headers: { Authorization: `Bearer ${token}` },
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
			title="Meddellande loggar"
			data={sortedLogs}
			columns={[
				{ header: "User ID", render: (l) => l.appUserId },
				{ header: "Conversation ID", render: (l) => l.conversationId },
				{ header: "IP Address", render: (l) => l.ipAddress },
				{
					header: "Created At",
					render: (l) => new Date(l.createdAt).toLocaleString(),
				},
			]}
		/>
	);
}
