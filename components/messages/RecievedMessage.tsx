interface RecievedMessageProps {
	content: string;
	sentAt: string;
	senderId?: number;
}

export function RecievedMessage({
	content,
	sentAt,
	senderId,
}: RecievedMessageProps) {
	return (
		<li className="flex justify-start my-2 list-none ml-5">
			<div className="flex flex-col max-w-[60%] bg-[#FFFFFF] text-black px-4 py-2 rounded-xl rounded-bl-none">
				<p className="m-0 max-w-full wrap-break-word">{content}</p>
				<span className="text-xs opacity-70">
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
				<span className="text-xs opacity-70">
					{senderId ? ` (ID: ${senderId})` : "Missing id"}
				</span>
			</div>
		</li>
	);
}
