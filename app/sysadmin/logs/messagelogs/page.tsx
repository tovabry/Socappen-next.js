import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";

interface MessageLog {
	id: number;
	appUserId: number;
	conversationId: number;
	ipAddress: string;
	createdAt: string;
}

export default async function MessageLogs() {
	const res = await serverFetch(
		"http://localhost:8080/api/admin/logs/messages",
	);
	const messageLogs: MessageLog[] = res.ok ? await res.json() : [];

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
