import { formatOnlyDate, formatTime } from "@/lib/formatDate";

interface RecievedMessageProps {
	content: string;
	sentAt: string;
	senderId?: number;
}

export function RecievedMessage({ content, sentAt }: RecievedMessageProps) {
	return (
		<li className="flex justify-start my-2 list-none px-3">
			<div className="max-w-[78%] sm:max-w-[65%] bg-(--message-received-color) text-black px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
				<p className="m-0 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
					{content}
				</p>
				<time className="mt-1 block text-start text-[11px] text-black/70">
					{formatOnlyDate(sentAt)}
				</time>
				<time className="block text-start text-[11px] text-black/70">
					{formatTime(sentAt)}
				</time>
			</div>
		</li>
	);
}
