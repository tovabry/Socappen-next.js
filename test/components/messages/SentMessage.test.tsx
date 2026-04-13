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

	test("Render senderId if provided", () => {
		render(
			<SentMessage
				content="Hello, this is a sent message!"
				sentAt={sentAt}
				senderId={12}
			/>,
		);
		expect(screen.getByText(/12/)).toBeInTheDocument();
	});

	test('Render "missing id" if senderId is not provided', () => {
		render(
			<SentMessage content="Hello, this is a sent message!" sentAt={sentAt} />,
		);
		expect(screen.getByText(/Missing id/)).toBeInTheDocument();
	});
});
