import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";

interface AuthLog {
	id: number;
	userId: number;
	ipAddress: string;
	success: boolean;
	failReason: string | null;
	loggedInAt: string;
	loggedOutAt: string | null;
	createdAt: string;
}

export default async function AuthLogs() {
	const res = await serverFetch(
		`${process.env.NEXT_PUBLIC_API_URL}/admin/logs/auth`,
	);
	const authLogs: AuthLog[] = res.ok ? await res.json() : [];
	const sortedLogs = sortLogsByCreatedAt(authLogs);

	return (
		<LogTable
			title="Auth loggar"
			data={sortedLogs}
			columns={[
				{ id: 1, header: "User ID", render: (l) => l.userId },
				{ id: 2, header: "IP adress", render: (l) => l.ipAddress },
				{ id: 3, header: "Lyckad", render: (l) => (l.success ? "Ja" : "Nej") },
				{ id: 4, header: "Anledning", render: (l) => l.failReason ?? "–" },
				{ id: 5, header: "Inloggad", render: (l) => formatDate(l.loggedInAt) },
				{
					id: 6,
					header: "Utloggad",
					render: (l) => (l.loggedOutAt ? formatDate(l.loggedOutAt) : "–"),
				},
				{ id: 7, header: "Skapad", render: (l) => formatDate(l.createdAt) },
			]}
		/>
	);
}
