import { saveToken, getToken, removeToken } from "@/lib/auth";

describe("Auth utilities", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	test("save token to localstorage", () => {
		saveToken("test-token");
		expect(localStorage.getItem("token")).toBe("test-token");
	});

	test("get token returns null if no token is saved", () => {
		expect(getToken()).toBeNull();
	});

	test("get token returns the saved token", () => {
		saveToken("test-token");
		expect(getToken()).toBe("test-token");
	});

	test("removeToken removes the token from localstorage", () => {
		saveToken("test-token");
		removeToken();
		expect(localStorage.getItem("token")).toBeNull();
	});
});
