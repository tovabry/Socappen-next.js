import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { serverFetch } from "@/lib/serverFetch";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";

interface FaqLog {
	id: number;
	appUserId: number;
	faqId: number;
	ipAddress: string;
	createdAt: string;
}

export default async function FaqLogs() {
	const res = await serverFetch("http://localhost:8080/api/admin/logs/faqs");
	const faqLogs: FaqLog[] = res.ok ? await res.json() : [];
	const sortedLogs = sortLogsByCreatedAt(faqLogs);

	return (
		<LogTable
			title="FAQ loggar"
			data={sortedLogs}
			columns={[
				{ id: 1, header: "User ID", render: (l) => l.appUserId },
				{ id: 2, header: "FAQ ID", render: (l) => l.faqId },
				{ id: 3, header: "IP adress", render: (l) => l.ipAddress },
				{ id: 4, header: "Skapad", render: (l) => formatDate(l.createdAt) },
			]}
		/>
	);
}
