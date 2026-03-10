"use client"

import { useEffect, useState } from "react";

interface ResponseUsers {
    userId: number,
    email: string,
    status: string,
    role: string,
    online: boolean

}

export default function usersPage() {
    const [users, setUsers] = useState<ResponseUsers[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/user/all")
        .then(res => res.json())
        .then((data: ResponseUsers[]) => setUsers(data))
        .catch(err => {
            console.error("Failed to fetch users", err);
            setUsers([]);
        })
    }, []);

    return (
        <div>
            <h1>All users</h1>
            <ul>
                {users.map(u => (
                    <li key={u.userId}>
                        <p><em>Användar-ID: </em>{u.userId} 
                        <em> E-post: </em>{u.email}
                        <em> Status: </em>{u.status}
                        <em> Role: </em>{u.role}
                        <em> Online: </em>{u.online ? "Yes" : "No"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}