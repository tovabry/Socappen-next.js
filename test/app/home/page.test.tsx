import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/home/page";

// mock fetch globally
global.fetch = jest.fn();

describe("HomePage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    //does not test the connection to real backend
    test("shows email from backend", async () => {

        // mock backend response
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({
                email: "test@example.com"
            })
        });

        render(<HomePage />);

        // initially shows Guest
        expect(screen.getByText(/Welcome, Guest/i)).toBeInTheDocument();

        // wait for email to appear
        await waitFor(() => {
            expect(
                screen.getByText(/Welcome, test@example.com/i)
            ).toBeInTheDocument();
        });
    });
});

test("shows anonymous user on fetch error", async () => {

    (fetch as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    render(<HomePage />);

    await waitFor(() => {
        expect(
            screen.getByText(/Welcome, anonymous user/i)
        ).toBeInTheDocument();
    });

});