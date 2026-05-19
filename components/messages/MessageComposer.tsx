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
				className="flex items-end gap-2 border-t border-gray-200 bg-white px-3 py-3"
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
					className="max-h-32 min-h-10 flex-1 resize-none overflow-y-auto rounded-2xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-(--accent-lightblue) [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
				/>
				<button
					type="submit"
					disabled={!value.trim()}
					className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--accent-lightblue) text-white disabled:opacity-40"
					aria-label="Skicka meddelande"
				>
					<Send size={18} strokeWidth={2} />
				</button>
			</form>

			{error && (
				<div className="text-red-500 bg-white text-sm text-center">{error}</div>
			)}
		</>
	);
}
