"use client";

import { useEffect, useState } from "react";

interface ResponseUsers {
	id: number;
	email: string;
	status: string;
	role: string;
	online: boolean;
}

export default function usersPage() {
	const [users, setUsers] = useState<ResponseUsers[]>([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/users/all")
			.then((res) => res.json())
			.then((data: ResponseUsers[]) => setUsers(data))
			.catch((err) => {
				console.error("Failed to fetch users", err);
				setUsers([]);
			});
	}, []);

	return (
		<div>
			<h1>All users</h1>
			<ul>
				{users.map((u) => (
					<li key={u.id}>
						<p>
							<em>Användar-ID: </em>
							{u.id}
							<em> Status: </em>
							{u.status}
							<em> Role: </em>
							{u.role}
							<em> Online: </em>
							{u.online ? "Yes" : "No"}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}
