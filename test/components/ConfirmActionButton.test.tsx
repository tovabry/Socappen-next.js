import { fireEvent, render, screen } from "@testing-library/react";
import { ConfirmActionButton } from "@/components/ConfirmActionButton";

describe("ConfirmActionButton", () => {
	test("opens dialog on trigger click", () => {
		render(
			<ConfirmActionButton
				action={async () => {}}
				hiddenFields={{ id: 1 }}
				message="Är du säker?"
			/>,
		);

		expect(screen.queryByText("Är du säker?")).not.toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /ta bort/i }));
		expect(screen.getByText("Är du säker?")).toBeInTheDocument();
	});

	test("closes dialog on Escape", () => {
		render(
			<ConfirmActionButton
				action={async () => {}}
				hiddenFields={{ id: 1 }}
				message="Är du säker?"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /ta bort/i }));
		expect(screen.getByText("Är du säker?")).toBeInTheDocument();

		fireEvent.keyDown(document, { key: "Escape" });
		expect(screen.queryByText("Är du säker?")).not.toBeInTheDocument();
	});

	test("closes dialog on cancel click", () => {
		render(
			<ConfirmActionButton
				action={async () => {}}
				hiddenFields={{ id: 1 }}
				message="Är du säker?"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /ta bort/i }));
		fireEvent.click(screen.getByRole("button", { name: /avbryt/i }));

		expect(screen.queryByText("Är du säker?")).not.toBeInTheDocument();
	});

	test("renders hidden fields in confirm form", () => {
		render(
			<ConfirmActionButton
				action={async () => {}}
				hiddenFields={{ userId: 10, permissionId: 2 }}
				message="Bekräfta"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: /ta bort/i }));

		expect(screen.getByDisplayValue("10")).toHaveAttribute("name", "userId");
		expect(screen.getByDisplayValue("2")).toHaveAttribute(
			"name",
			"permissionId",
		);
	});

	test("supports custom labels", () => {
		render(
			<ConfirmActionButton
				action={async () => {}}
				hiddenFields={{ id: 1 }}
				message="Bekräfta borttagning"
				triggerLabel="Radera konto"
				confirmLabel="Ja, radera"
				cancelLabel="Nej"
			/>,
		);

		expect(
			screen.getByRole("button", { name: /radera konto/i }),
		).toBeInTheDocument();
		fireEvent.click(screen.getByRole("button", { name: /radera konto/i }));

		expect(
			screen.getByRole("button", { name: /ja, radera/i }),
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /nej/i })).toBeInTheDocument();
	});
});
