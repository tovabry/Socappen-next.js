"use client";

import { useEffect, useState } from "react";

interface ResponseUser {
    email: string;
}

export default function HomePage() {
    const [user, setUser] = useState<string>("Guest");

    useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

        fetch("http://localhost:8080/api/users/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then((data: ResponseUser) => setUser(data.email))
            .catch(() => setUser("anonymous user"));
    }, []);

    return (
        <div>
            <h1>Welcome, {user}</h1>
        </div>
    );
}