import { render, screen } from "@testing-library/react";
import { SentMessage } from "@/components/messages/SentMessage";

const sentAt = "2026-04-13T10:30:00";

describe("Sent message component", () => {
	test("Render sentMessage content", () => {
		render(
			<SentMessage content="Hello, this is a sent message!" sentAt={sentAt} />,
		);
		const messageContent = screen.getByText("Hello, this is a sent message!");
		expect(messageContent).toBeInTheDocument();
	});

	test("Render sentAt timestamp", () => {
		render(
			<SentMessage content="Hello, this is a sent message!" sentAt={sentAt} />,
		);
		const timestamp = screen.getByText(/10:30/);
		expect(timestamp).toBeInTheDocument();
	});
});
