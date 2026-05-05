import { render, screen, fireEvent } from "@testing-library/react";
import { FaqList } from "@/components/faq/FaqList";

jest.mock("@/components/Header", () => ({
	Header: () => <div />,
}));

const faqs = [
	{ id: 1, question: "Vad är FAQ?", answer: "Vanliga frågor och svar." },
	{ id: 2, question: "Hur kontaktar jag er?", answer: "Via kontaktsidan." },
];

describe("Faq-List", () => {
	test("Shows all questions", () => {
		render(<FaqList faqs={faqs} isAdmin={false} hasFaqPermissions={true} />);
		expect(screen.getByText("Vad är FAQ?")).toBeInTheDocument();
		expect(screen.getByText("Hur kontaktar jag er?")).toBeInTheDocument();
	});

	test("Filters questions based on search input", () => {
		render(<FaqList faqs={faqs} isAdmin={false} hasFaqPermissions={true} />);
		fireEvent.change(screen.getByPlaceholderText("Sök..."), {
			target: { value: "kontakt" },
		});
		expect(screen.getByText("Hur kontaktar jag er?")).toBeInTheDocument();
		expect(screen.queryByText("Vad är FAQ?")).not.toBeInTheDocument();
	});

	test("Expands answer when clicking on question", () => {
		render(<FaqList faqs={faqs} isAdmin={false} hasFaqPermissions={true} />);
		expect(
			screen.queryByText("Vanliga frågor och svar."),
		).not.toBeInTheDocument();
		fireEvent.click(screen.getByText("Vad är FAQ?"));
		expect(screen.getByText("Vanliga frågor och svar.")).toBeInTheDocument();
	});

	test("Closes answer when clicking again", () => {
		render(<FaqList faqs={faqs} isAdmin={false} hasFaqPermissions={true} />);
		fireEvent.click(screen.getByText("Vad är FAQ?"));
		fireEvent.click(screen.getByText("Vad är FAQ?"));
		expect(
			screen.queryByText("Vanliga frågor och svar."),
		).not.toBeInTheDocument();
	});

	test("Shows + Add new FAQ button for admin", () => {
		render(<FaqList faqs={faqs} isAdmin={true} hasFaqPermissions={true} />);
		expect(screen.getByText("+ Lägg till ny FAQ")).toBeInTheDocument();
	});

	test("Hides + Add new FAQ button for non-admin", () => {
		render(<FaqList faqs={faqs} isAdmin={false} hasFaqPermissions={true} />);
		expect(screen.queryByText("+ Lägg till ny FAQ")).not.toBeInTheDocument();
	});

	test("Shows Edit link in expanded card for admin", () => {
		render(<FaqList faqs={faqs} isAdmin={true} hasFaqPermissions={true} />);
		fireEvent.click(screen.getByText("Vad är FAQ?"));
		expect(screen.getByText("Redigera")).toBeInTheDocument();
	});
});
