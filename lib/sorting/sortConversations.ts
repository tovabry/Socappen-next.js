export interface Conversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

/**
 * @returns Sorted list based of lastActivityAt where newest first
 */
export function sortConversationsByActivity(
	conversations: Conversation[],
): Conversation[] {
	return [...conversations].sort(
		(a, b) =>
			new Date(b.lastActivityAt).getTime() -
			new Date(a.lastActivityAt).getTime(),
	);
}
