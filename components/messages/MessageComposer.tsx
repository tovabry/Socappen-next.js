"use client";

import { Send } from "lucide-react";

interface Props {
	value: string;
	onChange: (value: string) => void;
	onSend: () => void;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	bottomRef: React.RefObject<HTMLDivElement | null>;
	error: string | null;
}

export function MessageComposer({
	value,
	onChange,
	onSend,
	textareaRef,
	bottomRef,
	error,
}: Props) {
	return (
		<>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onSend();
				}}
				className="flex flex-row p-1 py-4 w-full bg-white mx-auto"
			>
				<textarea
					ref={textareaRef}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
						const el = textareaRef.current;
						if (el) {
							el.style.height = "auto";
							el.style.height = `${el.scrollHeight}px`;
						}
					}}
					onFocus={() => {
						setTimeout(() => {
							bottomRef.current?.scrollIntoView({ behavior: "smooth" });
						}, 300);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							onSend();
						}
					}}
					name="Text-area för meddelande"
					placeholder="Skicka meddelande"
					aria-label="Skriv ditt meddelande här"
					rows={1}
					className="w-full resize-none overflow-y-auto focus:outline-none px-3 py-2 border border-gray-400 rounded-lg mx-2 shadow-sm max-h-22 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
				/>
				<button type="submit" className="mr-2 p-1" aria-label="Send message">
					<Send strokeWidth={1} />
				</button>
			</form>

			{error && (
				<div className="text-red-500 bg-white text-sm text-center">{error}</div>
			)}
		</>
	);
}
