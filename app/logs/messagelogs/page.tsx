"use client";
import { getToken } from "@/lib/auth";
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

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-4">Message Logs</h1>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">User ID</th>
						<th className="py-2 px-4 border-b">Conversation ID</th>
						<th className="py-2 px-4 border-b">IP Address</th>
						<th className="py-2 px-4 border-b">Created At</th>
					</tr>
				</thead>
				<tbody>
					{messageLogs.map((log) => (
						<tr key={log.id}>
							<td className="py-2 px-4 border-b">{log.appUserId}</td>
							<td className="py-2 px-4 border-b">{log.conversationId}</td>
							<td className="py-2 px-4 border-b">{log.ipAddress}</td>
							<td className="py-2 px-4 border-b">
								{new Date(log.createdAt).toLocaleString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
