jest.mock("@/lib/auth", () => ({ getToken: () => "fake-token" }));

import {
	mergeOlderMessages,
	Message,
	fetchMessagePage,
	postMessage,
	validateMessageContent,
	MessageValidationError,
} from "@/lib/messages";

const msg = (id: number): Message => ({
	id,
	senderId: 1,
	content: `Message ${id}`,
	sentAt: "2026-04-13T10:00:00",
});

describe("mergeOlderMessages", () => {
	test("prepends older messages before current", () => {
		const result = mergeOlderMessages([msg(1), msg(2)], [msg(3), msg(4)]);
		expect(result.map((m) => m.id)).toEqual([1, 2, 3, 4]);
	});

	test("removes duplicates that exist in current", () => {
		const result = mergeOlderMessages(
			[msg(1), msg(2), msg(3)],
			[msg(3), msg(4)],
		);
		expect(result.map((m) => m.id)).toEqual([1, 2, 3, 4]);
	});

	test("returns only current if older is empty", () => {
		const result = mergeOlderMessages([], [msg(1), msg(2)]);
		expect(result.map((m) => m.id)).toEqual([1, 2]);
	});

	test("returns only older if current is empty", () => {
		const result = mergeOlderMessages([msg(1), msg(2)], []);
		expect(result.map((m) => m.id)).toEqual([1, 2]);
	});
});

describe("fetchMessagePage", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	test("Returns messages in reverse order", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => [
				{ id: 1, senderId: 1, content: "First", sentAt: "2026-01-01T10:00:00" },
				{
					id: 2,
					senderId: 1,
					content: "Second",
					sentAt: "2026-01-01T10:01:00",
				},
			],
		});
		const result = await fetchMessagePage("conv-1", 0);
		expect(result.map((m) => m.id)).toEqual([2, 1]);
	});

	test("Throws error on HTTP failure", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 403 });
		await expect(fetchMessagePage("conv-1", 0)).rejects.toThrow("HTTP 403");
	});

	test("Sends Authorization header", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => [],
		});
		await fetchMessagePage("conv-1", 0);
		expect(fetch).toHaveBeenCalledWith(
			expect.stringContaining("conv-1"),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: "Bearer fake-token",
				}),
			}),
		);
	});
});

describe("postMessage", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});
	test("Throws error on HTTP failure", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
		await expect(postMessage("conv-1", "Hej")).rejects.toThrow("HTTP 500");
	});

	test("throws MessageValidationError on empty content", async () => {
		await expect(postMessage("conv-1", "")).rejects.toThrow(
			MessageValidationError,
		);
		expect(fetch).not.toHaveBeenCalled();
	});
});

describe("validateMessageContent", () => {
	test("throws on empty string", () => {
		expect(() => validateMessageContent("")).toThrow(MessageValidationError);
	});

	test("throws on whitespace only", () => {
		expect(() => validateMessageContent("   ")).toThrow(MessageValidationError);
	});

	test("throws if content exceeds 1000 characters", () => {
		expect(() => validateMessageContent("a".repeat(1001))).toThrow(
			MessageValidationError,
		);
	});

	test("does not throw on valid content", () => {
		expect(() => validateMessageContent("Hej!")).not.toThrow();
	});

	test("does not throw on exactly 1000 characters", () => {
		expect(() => validateMessageContent("a".repeat(1000))).not.toThrow();
	});
});
