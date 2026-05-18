import { sortLogsByCreatedAt } from "@/lib/sorting/sortLogs";

const log = (id: number, createdAt: string) => ({
	id,
	createdAt,
});

describe("sortLogsByCreatedAt", () => {
	test("Sort logs by latest createdAt first (date)", () => {
		const result = sortLogsByCreatedAt([
			log(1, "2026-01-01T10:00:00"),
			log(2, "2026-01-03T10:00:00"),
			log(3, "2026-01-02T10:00:00"),
		]);
		expect(result.map((c) => c.id)).toEqual([2, 3, 1]);
	});

	test("Does not mutate the original array", () => {
		const original = [
			log(1, "2026-01-01T10:00:00"),
			log(2, "2026-01-03T10:00:00"),
		];
		sortLogsByCreatedAt(original);
		expect(original[0].id).toBe(1);
	});

	test("Sort logs by latest createdAt first (time)", () => {
		const result = sortLogsByCreatedAt([
			log(1, "2026-01-01T08:00:00"),
			log(2, "2026-01-01T12:00:00"),
			log(3, "2026-01-01T10:00:00"),
		]);
		expect(result.map((c) => c.id)).toEqual([2, 3, 1]);
	});
});
