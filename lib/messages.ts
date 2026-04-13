import { getToken } from "@/lib/auth";

export const pageSize = 20;

export interface Message {
	id: number;
	senderId: number;
	content: string;
	sentAt: string;
}

export class MessageValidationError extends Error {}

export function validateMessageContent(content: string): void {
	if (!content.trim()) {
		throw new MessageValidationError("Message content cannot be empty");
	}
	if (content.length > 1000) {
		throw new MessageValidationError("Max 1000 characters allowed");
	}
}

export async function fetchMessagePage(
	conversationId: string,
	page: number,
	signal?: AbortSignal,
): Promise<Message[]> {
	const token = getToken();
	const res = await fetch(
		`http://localhost:8080/api/conversations/${conversationId}/messages?page=${page}&size=${pageSize}`,
		{ headers: { Authorization: `Bearer ${token}` }, signal },
	);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return (data as Message[]).reverse();
}

export async function postMessage(
	conversationId: string,
	content: string,
): Promise<void> {
	validateMessageContent(content);
	const token = getToken();
	const res = await fetch(
		`http://localhost:8080/api/conversations/${conversationId}/messages`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ content }),
		},
	);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export function mergeOlderMessages(
	older: Message[],
	current: Message[],
): Message[] {
	const existingIds = new Set(current.map((m) => m.id));
	return [...older.filter((m) => !existingIds.has(m.id)), ...current];
}
