
"use client"; // Required for useEffect and useState in app directory

import { useEffect, useState } from "react";

interface ResponseUser {
    email: string;
}

export default function HomePage() {
    const [user, setUser] = useState<string>("Guest");

    useEffect(() => {
        fetch("http://localhost:8080/api/users/me")
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