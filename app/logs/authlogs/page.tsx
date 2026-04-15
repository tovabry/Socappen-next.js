"use client";
import { LogTable } from "@/components/logs/LogTable";
import { getToken } from "@/lib/auth";
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
		const token = getToken();
		if (!token) return;

		const fetchLogs = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/admin/logs/auth", {
					headers: { Authorization: `Bearer ${token}` },
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
				{ header: "User ID", render: (l) => l.userId },
				{ header: "IP", render: (l) => l.ipAddress },
				{ header: "Lyckad", render: (l) => (l.success ? "Ja" : "Nej") },
				{ header: "Anledning", render: (l) => l.failReason ?? "–" },
				{ header: "Inloggad", render: (l) => formatDate(l.loggedInAt) },
				{
					header: "Utloggad",
					render: (l) => (l.loggedOutAt ? formatDate(l.loggedOutAt) : "–"),
				},
				{ header: "Skapad", render: (l) => formatDate(l.createdAt) },
			]}
		/>
	);
}
