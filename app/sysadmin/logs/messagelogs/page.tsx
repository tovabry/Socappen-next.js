import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { hasPermission } from "@/lib/getPermissions";
import { serverFetch } from "@/lib/serverFetch";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";
import { redirect } from "next/navigation";

interface MessageLog {
	id: number;
	appUserId: number;
	conversationId: number;
	ipAddress: string;
	createdAt: string;
}

export default async function MessageLogs() {
	const hasLogViewPermissions = await hasPermission("view_logs");
	if (!hasLogViewPermissions) redirect("/home");

	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/admin/logs/messages`,
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
