"use client";
import { useEffect, useState } from "react";

interface FaqLog {
	id: number;
	appUserId: number;
	faqId: number;
	ipAddress: string;
	createdAt: string;
}

export default function FaqLogs() {
	const [faqLogs, setFaqLogs] = useState<FaqLog[]>([]);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				const res = await fetch("http://localhost:8080/api/admin/logs/faqs", {
					credentials: "include",
				});
				const data = await res.json();
				setFaqLogs(data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchLogs();
	}, []);

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-4">FAQ Logs</h1>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">User ID</th>
						<th className="py-2 px-4 border-b">FAQ ID</th>
						<th className="py-2 px-4 border-b">IP Address</th>
						<th className="py-2 px-4 border-b">Created At</th>
					</tr>
				</thead>
				<tbody>
					{faqLogs.map((log) => (
						<tr key={log.id}>
							<td className="py-2 px-4 border-b">{log.appUserId}</td>
							<td className="py-2 px-4 border-b">{log.faqId}</td>
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
