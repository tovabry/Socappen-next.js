"use client";
import { LogTable } from "@/components/logs/LogTable";
import { formatDate } from "@/lib/formatDate";
import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";
import { useEffect, useState } from "react";

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

export default function AuthLogs() {
	const [authLogs, setAuthLogs] = useState<AuthLog[]>([]);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/admin/logs/auth", {
					credentials: "include",
				});
				const data = await res.json();
				setAuthLogs(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchLogs();
	}, []);

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
