import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteFaqButton } from "@/components/faq/DeleteFaqButton";

jest.mock("@/app/faq/actions", () => ({
	deleteFaq: jest.fn(),
}));

describe("DeleteFaqButton", () => {
	test("Shows Delete button", () => {
		render(<DeleteFaqButton faqId="1" />);
		expect(screen.getByText("Ta bort")).toBeInTheDocument();
	});

	test("Opens confirmation popover on click", () => {
		render(<DeleteFaqButton faqId="1" />);
		expect(
			screen.queryByText("Är du säker på att du vill ta bort denna FAQ?"),
		).not.toBeInTheDocument();
		fireEvent.click(screen.getByText("Ta bort"));
		expect(
			screen.getByText("Är du säker på att du vill ta bort denna FAQ?"),
		).toBeInTheDocument();
	});

	test("Closes popover on Cancel click", () => {
		render(<DeleteFaqButton faqId="1" />);
		fireEvent.click(screen.getByText("Ta bort"));
		fireEvent.click(screen.getByText("Avbryt"));
		expect(
			screen.queryByText("Är du säker på att du vill ta bort denna FAQ?"),
		).not.toBeInTheDocument();
	});
});
