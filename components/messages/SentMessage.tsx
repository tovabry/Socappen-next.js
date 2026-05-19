import { formatDate, formatOnlyDate, formatTime } from "@/lib/formatDate";

interface SentMessageProps {
	content: string;
	sentAt: string;
	senderId?: number;
}

export function SentMessage({ content, sentAt }: SentMessageProps) {
	return (
		<li className="flex justify-end my-2 list-none px-3">
			<div className="max-w-[78%] sm:max-w-[65%] bg-(--message-sent-color) text-white px-4 py-2 rounded-2xl rounded-br-md shadow-sm">
				<p className="m-0 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
					{content}
				</p>
				<time className="mt-1 block text-right text-[11px] text-white/70">
					{formatOnlyDate(sentAt)}
				</time>
				<time className="block text-right text-[11px] text-white/70">
					{formatTime(sentAt)}
				</time>
			</div>
		</li>
	);
}
