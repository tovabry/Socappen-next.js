import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "@/app/login/signup/page";

describe("SignupPage", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	test("Shows error when email is empty on submit", async () => {
		render(<SignupPage />);
		fireEvent.click(screen.getByRole("button", { name: /registrera konto/i }));
		await waitFor(() => {
			expect(screen.getByText("Email krävs.")).toBeInTheDocument();
		});
		expect(fetch).not.toHaveBeenCalled();
	});

	test("Shows error if password is less than 8 characters", async () => {
		render(<SignupPage />);
		fireEvent.change(screen.getByLabelText(/e-post/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/^lösenord$/i), {
			target: { value: "short" },
		});
		fireEvent.click(screen.getByRole("button", { name: /registrera konto/i }));
		await waitFor(() => {
			expect(
				screen.getByText("Lösenord måste vara minst 8 tecken."),
			).toBeInTheDocument();
		});
		expect(fetch).not.toHaveBeenCalled();
	});

	test("Shows error if password and confirm password do not match", async () => {
		render(<SignupPage />);
		fireEvent.change(screen.getByLabelText(/^lösenord$/i), {
			target: { value: "password123" },
		});
		fireEvent.change(screen.getByLabelText(/bekräfta/i), {
			target: { value: "differentpassword123" },
		});
		fireEvent.click(screen.getByRole("button", { name: /registrera konto/i }));
		await waitFor(() => {
			expect(screen.getByText("Lösenorden matchar inte.")).toBeInTheDocument();
		});
		expect(fetch).not.toHaveBeenCalled();
	});

	test("Shows network error on failed signup", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: async () => ({ error: "Email already in use" }),
		});
		render(<SignupPage />);
		fireEvent.change(screen.getByLabelText(/e-post/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/^lösenord/i), {
			target: { value: "password123" },
		});
		fireEvent.change(screen.getByLabelText(/bekräfta/i), {
			target: { value: "password123" },
		});
		fireEvent.submit(screen.getByRole("button", { name: /registrera konto/i }));
		await waitFor(() => {
			expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
		});
	});

	test("Shows success message on successful signup", async () => {
		(fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				id: 1,
				email: "test@test.com",
				status: "active",
				role: "user",
				online: false,
			}),
		});
		render(<SignupPage />);
		fireEvent.change(screen.getByLabelText(/e-post/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/^lösenord/i), {
			target: { value: "password123" },
		});
		fireEvent.change(screen.getByLabelText(/bekräfta/i), {
			target: { value: "password123" },
		});
		fireEvent.submit(screen.getByRole("button", { name: /registrera konto/i }));
		await waitFor(() => {
			expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
		});
	});
});
