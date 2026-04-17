export const pageSize = 20;

export interface Message {
	id: number;
	senderId: number;
	content: string;
	sentAt: string;
}

export class MessageValidationError extends Error {}

/**
 * @throws {MessageValidationError} if content is empty or over 1000 characters
 */
export function validateMessageContent(content: string): void {
	if (!content.trim()) {
		throw new MessageValidationError("Message content cannot be empty");
	}
	if (content.length > 1000) {
		throw new MessageValidationError("Max 1000 characters allowed");
	}
}

// Fetches a page of messages for a conversation with optional abort signal
export async function fetchMessagePage(
	conversationId: string,
	page: number,
	signal?: AbortSignal,
): Promise<Message[]> {
	const res = await fetch(
		`http://localhost:8080/api/conversations/${conversationId}/messages?page=${page}&size=${pageSize}`,
		{ credentials: "include", signal },
	);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	return (data as Message[]).reverse();
}

// Posts a new message to the backend throws an error if it fails
export async function postMessage(
	conversationId: string,
	content: string,
): Promise<void> {
	validateMessageContent(content);
	const res = await fetch(
		`http://localhost:8080/api/conversations/${conversationId}/messages`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ content }),
		},
	);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// Merges older messages with the current list, ensuring no duplicates based on message id and maintaining order with older messages first
export function mergeOlderMessages(
	older: Message[],
	current: Message[],
): Message[] {
	const existingIds = new Set(current.map((m) => m.id));
	return [...older.filter((m) => !existingIds.has(m.id)), ...current];
}
