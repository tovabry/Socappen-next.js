import {
	sortConversationsByActivity,
	Conversation,
} from "@/lib/sorting/sortConversations";

const conv = (id: number, lastActivityAt: string): Conversation => ({
	id,
	createdAt: "2026-01-01T00:00:00",
	status: "active",
	lastActivityAt,
});

describe("sortConversationsByActivity", () => {
	test("Sort conversations by latest activity first (date)", () => {
		const result = sortConversationsByActivity([
			conv(1, "2026-01-01T10:00:00"),
			conv(2, "2026-01-03T10:00:00"),
			conv(3, "2026-01-02T10:00:00"),
		]);
		expect(result.map((c) => c.id)).toEqual([2, 3, 1]);
	});

	test("Does not mutate the original array", () => {
		const original = [
			conv(1, "2026-01-01T10:00:00"),
			conv(2, "2026-01-03T10:00:00"),
		];
		sortConversationsByActivity(original);
		expect(original[0].id).toBe(1);
	});

	test("Sort conversations by latest activity first (time)", () => {
		const result = sortConversationsByActivity([
			conv(1, "2026-01-01T08:00:00"),
			conv(2, "2026-01-01T12:00:00"),
			conv(3, "2026-01-01T10:00:00"),
		]);
		expect(result.map((c) => c.id)).toEqual([2, 3, 1]);
	});
});
