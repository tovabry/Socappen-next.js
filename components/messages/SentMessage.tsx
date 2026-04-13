interface SentMessageProps {
	content: string;
	sentAt: string;
	senderId?: number;
}

export function SentMessage({ content, sentAt, senderId }: SentMessageProps) {
	return (
		<li className="flex justify-end my-2 list-none mr-5">
			<div className="flex flex-col max-w-[60%] bg-[#DDB8B8] text-black px-4 py-2 rounded-xl rounded-br-none">
				<p className="m-0 max-w-full wrap-break-word">{content}</p>
				<span className="text-xs opacity-70 flex justify-end">
					{new Date(sentAt).toLocaleDateString("sv-SE", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
					})}{" "}
					{new Date(sentAt).toLocaleTimeString("sv-SE", {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>
				<span className="text-xs opacity-70 flex justify-end">
					{senderId ? `${senderId}` : "Missing id"}
				</span>
			</div>
		</li>
	);
}
