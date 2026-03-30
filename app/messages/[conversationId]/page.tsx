"use client";

import { useEffect, useState } from "react";
import React from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/lib/auth";
import { useParams } from "next/navigation";

interface ResponseMessage {
    id: number;
    senderId: number;
    content: string;
    sentAt: string;
}

interface SendMessage {
    content: string;
}

export default function MessagesPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;

    const [messages, setMessages] = useState<ResponseMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (!conversationId) return;

        const token = getToken();

        fetch(`http://localhost:8080/api/conversations/${conversationId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: ResponseMessage[]) => {
                console.log("messages:", data);
                setMessages(data);
            })
            .catch(err => console.error("Failed to fetch messages", err));
    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) return;

        const token = getToken();

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        client.onConnect = () => {
            client.subscribe(`/conversation/${conversationId}`, (msg) => {
                const message: ResponseMessage = JSON.parse(msg.body);
                setMessages(prev => [...prev, message]);
            });
        };

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [conversationId]);

    const handleSendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const token = getToken();

        const dto: SendMessage = {
            content: newMessage,
        };

        fetch(`http://localhost:8080/api/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(() => setNewMessage(""))
            .catch(err => console.error("Failed to send message", err));
    };

    return (
        <div>
            <h1>Conversation {conversationId} Messages</h1>

            <ul style={{ maxHeight: "400px", overflowY: "auto", padding: 0 }}>
                {messages.map(m => (
                    <li key={m.id} style={{ listStyle: "none", marginBottom: "10px" }}>
                        <p>
                            <strong>Sender ID:</strong> {m.senderId} <br />
                            <strong>Content:</strong> {m.content} <br />
                            <strong>Sent At:</strong> {new Date(m.sentAt).toLocaleString()}
                        </p>
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: "300px", marginRight: "5px" }}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}