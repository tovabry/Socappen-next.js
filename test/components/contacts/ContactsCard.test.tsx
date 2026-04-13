import { ContactsCard } from "@/components/ContactsCard";
import { render, screen } from "@testing-library/react";

describe("ContactsCard", () => {
	test("Adds https:// to website if it doesn't start with http", () => {
		render(
			<ContactsCard contactName="Test Link" contactWebsite="www.test.com" />,
		);
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			"https://www.test.com",
		);
	});

	test("Keeps website as is if it starts with http", () => {
		render(
			<ContactsCard
				contactName="Test Link"
				contactWebsite="https://www.test.com"
			/>,
		);
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			"https://www.test.com",
		);
	});

	test("Renders no link if contactWebsite is not provided", () => {
		render(<ContactsCard contactName="Test" />);
		expect(screen.queryByRole("link")).not.toBeInTheDocument();
	});
});
