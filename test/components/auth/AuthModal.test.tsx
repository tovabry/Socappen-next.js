import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/context/AuthContext";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

jest.mock("@/lib/context/AuthContext", () => ({
	useAuth: jest.fn(),
}));
jest.mock("@/components/auth/LoginForm", () => ({
	__esModule: true,
	default: () => <div>Mocked LoginForm</div>,
}));
jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

describe("AuthModal", () => {
	beforeEach(() => {
		(useAuth as jest.Mock).mockReturnValue({ user: null, logout: jest.fn() });
	});

	test("Render nothing when open is false", () => {
		render(<AuthModal open={false} onClose={jest.fn()} />);
		expect(screen.queryByText(/logga ut/i)).not.toBeInTheDocument();
		expect(screen.queryByText(/logga in/i)).not.toBeInTheDocument();
	});

	test("Show login form when no user is logged in", () => {
		render(<AuthModal open={true} onClose={jest.fn()} />);
		expect(screen.getByText(/Mocked LoginForm/i)).toBeInTheDocument();
	});

	test("show email and logout button when user is logged in", () => {
		(useAuth as jest.Mock).mockReturnValue({
			user: { email: "test@test.com", roles: [] },
			logout: jest.fn(),
		});
		render(<AuthModal open={true} onClose={jest.fn()} />);
		expect(screen.getByText(/test@test.com/i)).toBeInTheDocument();
		expect(screen.getByText(/logga ut/i)).toBeInTheDocument();
	});

	test("Logout calls logout and onClose", async () => {
		const logout = jest.fn().mockResolvedValue(undefined);
		const onClose = jest.fn();
		(useAuth as jest.Mock).mockReturnValue({
			user: { email: "test@test.com", roles: [] },
			logout,
		});
		render(<AuthModal open={true} onClose={onClose} />);
		fireEvent.click(screen.getByText(/logga ut/i));
		await waitFor(() => {
			expect(logout).toHaveBeenCalled();
			expect(onClose).toHaveBeenCalled();
		});
	});

	test("Close-button calls onClose", () => {
		const onClose = jest.fn();
		render(<AuthModal open={true} onClose={onClose} />);
		fireEvent.click(screen.getByLabelText(/close login window/i));
		expect(onClose).toHaveBeenCalled();
	});
});
