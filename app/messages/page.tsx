"use client";

import { useEffect, useState, FormEvent } from "react";
import { Client, Message as StompMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface ResponseMessage {
    id: number;
    senderId: number;
    content: string;
    sentAt: string;
}

interface SendMessage {
    senderId: number;
    content: string;
}

interface MessagePageProps {
    conversationId: number;
    currentUserId: number; // ID of logged-in user
}

export default function MessagesPage({ conversationId, currentUserId }: MessagePageProps) {
    const [messages, setMessages] = useState<ResponseMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);

    // Fetch initial messages
    useEffect(() => {
        fetch(`http://localhost:8080/api/conversations/${conversationId}/messages`)
            .then(res => res.json())
            .then((data: ResponseMessage[]) => setMessages(data))
            .catch(err => {
                console.error("Failed to fetch messages", err);
                setMessages([]);
            });
    }, [conversationId]);

    // WebSocket connection for real-time messages
   useEffect(() => {
    const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        reconnectDelay: 5000,
    });

    client.onConnect = () => {
        client.subscribe(`/topic/conversation/${conversationId}`, (msg) => {
            const message: ResponseMessage = JSON.parse(msg.body);
            setMessages(prev => [...prev, message]);
        });
    };

    client.activate();

    // cleanup
    return () => {
        client.deactivate(); 
    };
}, [conversationId]);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const dto: SendMessage = {
            senderId: currentUserId,
            content: newMessage
        };

        fetch(`http://localhost:8080/api/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        })
            .then(res => res.json())
            .then((savedMessage: ResponseMessage) => {
                // WebSocket will push it to everyone including this client
                setNewMessage("");
            })
            .catch(err => {
                console.error("Failed to send message", err);
            });
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