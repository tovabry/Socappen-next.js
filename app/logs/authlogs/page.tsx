"use client";
import { getToken } from "@/lib/auth";
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

	return (
		<div className="w-full">
			<h1 className="text-2xl font-bold mb-4">Authentication Logs</h1>
			<table className="min-w-full bg-white">
				<thead>
					<tr>
						<th className="py-2 px-4 border-b">ID</th>
						<th className="py-2 px-4 border-b">User ID</th>
						<th className="py-2 px-4 border-b">IP Address</th>
						<th className="py-2 px-4 border-b">Success</th>
						<th className="py-2 px-4 border-b">Fail Reason</th>
						<th className="py-2 px-4 border-b">Logged In At</th>
						<th className="py-2 px-4 border-b">Logged Out At</th>
						<th className="py-2 px-4 border-b">Created At</th>
					</tr>
				</thead>
				<tbody>
					{authLogs.map((log) => (
						<tr key={log.id}>
							<td className="py-2 px-4 border-b">{log.id}</td>
							<td className="py-2 px-4 border-b">{log.userId}</td>
							<td className="py-2 px-4 border-b">{log.ipAddress}</td>
							<td className="py-2 px-4 border-b">
								{log.success ? "Yes" : "No"}
							</td>
							<td className="py-2 px-4 border-b">{log.failReason || "N/A"}</td>
							<td className="py-2 px-4 border-b">
								{new Date(log.loggedInAt).toLocaleString()}
							</td>
							<td className="py-2 px-4 border-b">
								{log.loggedOutAt
									? new Date(log.loggedOutAt).toLocaleString()
									: "N/A"}
							</td>
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
