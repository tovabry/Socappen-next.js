export interface ResponseConversation {
	id: number;
	createdAt: string;
	status: string;
	lastActivityAt: string;
	conversationCount: number;
	participantEmail: string;
}

/**
 * @returns Sorted list based of lastActivityAt where newest first
 */
export function sortConversationsByActivity(
	conversations: ResponseConversation[],
): ResponseConversation[] {
	return [...conversations].sort(
		(a, b) =>
			new Date(b.lastActivityAt).getTime() -
			new Date(a.lastActivityAt).getTime(),
	);
}
