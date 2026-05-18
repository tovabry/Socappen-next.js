import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/auth/LoginForm";

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: jest.fn() }),
}));
jest.mock("@/lib/context/AuthContext", () => ({
	useAuth: () => ({ setUser: jest.fn() }),
}));
jest.mock("@/lib/auth", () => ({
	saveToken: jest.fn(),
	fetchCurrentUser: jest
		.fn()
		.mockResolvedValue({ email: "test@test.com", roles: [] }),
}));

describe("LoginForm", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	test("Render error message if login fails", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
		render(<LoginForm />);
		fireEvent.change(screen.getByLabelText(/e-post/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/lösenord/i), {
			target: { value: "fel" },
		});
		fireEvent.submit(screen.getByRole("button", { name: /logga in/i }));
		await waitFor(() => {
			expect(
				screen.getByText(/ogiltig e-post eller lösenord/i),
			).toBeInTheDocument();
		});
	});

	test("Render error message on network error", async () => {
		(fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));
		render(<LoginForm />);
		fireEvent.submit(screen.getByRole("button", { name: /logga in/i }));
		await waitFor(() => {
			expect(screen.getByText(/något gick fel/i)).toBeInTheDocument();
		});
	});

	test("calls onSuccess after successful login", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ token: "fake.jwt.token" }),
		});
		const onSuccess = jest.fn();
		render(<LoginForm onSuccess={onSuccess} />);
		fireEvent.change(screen.getByLabelText(/e-post/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/lösenord/i), {
			target: { value: "pass" },
		});
		fireEvent.submit(screen.getByRole("button", { name: /logga in/i }));
		await waitFor(() => expect(onSuccess).toHaveBeenCalled());
	});
});
