import { getPermissions, hasPermission } from "@/lib/getPermissions";

jest.mock("next/headers", () => ({
	cookies: jest.fn(),
}));

jest.mock("@/lib/serverFetch", () => ({
	serverFetch: jest.fn(),
}));

import { cookies } from "next/headers";
import { serverFetch } from "@/lib/serverFetch";

describe("getPermissions", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("returns empty set when token cookie is missing", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => undefined,
		});

		const result = await getPermissions();

		expect(result.size).toBe(0);
		expect(serverFetch).not.toHaveBeenCalled();
	});

	test("returns empty set on 401 from /users/me", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => ({ value: "token" }),
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: false,
			status: 401,
			text: async () => "Unauthorized",
		});

		const result = await getPermissions();

		expect(result.size).toBe(0);
	});

	test("returns empty set on 403 from /users/me", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => ({ value: "token" }),
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: false,
			status: 403,
			text: async () => "Forbidden",
		});

		const result = await getPermissions();

		expect(result.size).toBe(0);
	});

	test("returns permission set from /users/me", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => ({ value: "token" }),
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				id: 7,
				email: "admin@test.se",
				role: "ROLE_ADMIN",
				permissions: ["manage_faq", "manage_post", " view_logs "],
			}),
		});

		const result = await getPermissions();

		expect(result.has("manage_faq")).toBe(true);
		expect(result.has("manage_post")).toBe(true);
		expect(result.has("view_logs")).toBe(true); // trim check
	});

	test("hasPermission returns true when permission exists", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => ({ value: "token" }),
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				permissions: ["manage_faq"],
			}),
		});

		await expect(hasPermission("manage_faq")).resolves.toBe(true);
	});

	test("hasPermission returns false when permission does not exist", async () => {
		(cookies as jest.Mock).mockResolvedValue({
			get: () => ({ value: "token" }),
		});

		(serverFetch as jest.Mock).mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({
				permissions: ["manage_post"],
			}),
		});

		await expect(hasPermission("manage_faq")).resolves.toBe(false);
	});
});
