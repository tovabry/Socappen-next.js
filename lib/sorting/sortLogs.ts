export interface AuthLog {
	id: number;
	userId: number;
	ipAddress: string;
	success: boolean;
	failReason: string | null;
	loggedInAt: string;
	loggedOutAt: string | null;
	createdAt: string;
}

export interface MessageLog {
	id: number;
	appUserId: number;
	conversationId: number;
	ipAddress: string;
	createdAt: string;
}

export function sortLogsByCreatedAt<T extends { createdAt: string }>(
	logs: T[],
): T[] {
	return [...logs].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
	);
}
