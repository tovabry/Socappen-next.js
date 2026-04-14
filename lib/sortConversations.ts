export interface Conversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
}

export function sortConversationsByActivity(
	conversations: Conversation[],
): Conversation[] {
	return [...conversations].sort(
		(a, b) =>
			new Date(b.lastActivityAt).getTime() -
			new Date(a.lastActivityAt).getTime(),
	);
}
