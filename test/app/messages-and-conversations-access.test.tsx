import React from "react";

const REDIRECT_ERROR = "NEXT_REDIRECT";

jest.mock("next/navigation", () => ({
	redirect: jest.fn(() => {
		throw new Error(REDIRECT_ERROR);
	}),
}));

jest.mock("@/lib/getRole", () => ({
	getRoles: jest.fn(),
}));

jest.mock("@/lib/serverFetch", () => ({
	serverFetch: jest.fn(),
}));

jest.mock("@/app/messages/[conversationId]/MessageClient", () => ({
	__esModule: true,
	default: ({ conversationId }: { conversationId: string }) => (
		<div data-testid="messages-client">{conversationId}</div>
	),
}));

import { redirect } from "next/navigation";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";
import Page from "@/app/messages/[conversationId]/page";

describe("messages/[conversationId] access checks", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("redirects to /home when user has no allowed role", async () => {
		(getRoles as jest.Mock).mockResolvedValue({
			isAdmin: false,
			isUser: false,
			isSysAdmin: false,
		});

		await expect(
			Page({ params: Promise.resolve({ conversationId: "10" }) }),
		).rejects.toThrow(REDIRECT_ERROR);

		expect(redirect).toHaveBeenCalledWith("/home");
	});

	test("redirects to /messages when conversationId is invalid", async () => {
		(getRoles as jest.Mock).mockResolvedValue({
			isAdmin: false,
			isUser: true,
			isSysAdmin: false,
		});

		await expect(
			Page({ params: Promise.resolve({ conversationId: "abc" }) }),
		).rejects.toThrow(REDIRECT_ERROR);

		expect(redirect).toHaveBeenCalledWith("/messages");
	});

	test("redirects to /messages when conversations fetch fails", async () => {
		(getRoles as jest.Mock).mockResolvedValue({
			isAdmin: true,
			isUser: false,
			isSysAdmin: false,
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: false,
			json: async () => [],
		});

		await expect(
			Page({ params: Promise.resolve({ conversationId: "10" }) }),
		).rejects.toThrow(REDIRECT_ERROR);

		expect(redirect).toHaveBeenCalledWith("/messages");
	});

	test("redirects to /messages when user is not a participant", async () => {
		(getRoles as jest.Mock).mockResolvedValue({
			isAdmin: true,
			isUser: false,
			isSysAdmin: false,
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => [{ id: 1 }, { id: 2 }],
		});

		await expect(
			Page({ params: Promise.resolve({ conversationId: "10" }) }),
		).rejects.toThrow(REDIRECT_ERROR);

		expect(redirect).toHaveBeenCalledWith("/messages");
	});

	test("renders MessagesClient when user is participant", async () => {
		(getRoles as jest.Mock).mockResolvedValue({
			isAdmin: false,
			isUser: true,
			isSysAdmin: false,
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => [{ id: 10 }, { id: 2 }],
		});

		const result = await Page({
			params: Promise.resolve({ conversationId: "10" }),
		});

		expect(redirect).not.toHaveBeenCalled();
		expect(React.isValidElement(result)).toBe(true);
		if (React.isValidElement(result)) {
			expect((result.props as { conversationId: string }).conversationId).toBe(
				"10",
			);
		}
	});
});
