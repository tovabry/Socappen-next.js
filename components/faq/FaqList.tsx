"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ChevronDown } from "lucide-react";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

interface Props {
	faqs: ResponseFaq[];
	isAdmin: boolean;
}

export function FaqList({ faqs, isAdmin }: Props) {
	const [searchQuery, setSearchQuery] = useState("");
	const [openId, setOpenId] = useState<number | null>(null);

	const filtered = faqs.filter((faq) =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="w-full">
			<Header title="Vanligt förekommande frågor" backRouteLink="/home" />
			<div className="flex items-center gap-4 mx-10 mt-5 flex-col md:flex-row">
				{isAdmin && (
					<a
						href="/faq/new"
						className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm whitespace-nowrap"
					>
						+ Lägg till ny FAQ
					</a>
				)}
				<input
					onChange={(e) => setSearchQuery(e.target.value)}
					type="text"
					placeholder="Sök..."
					className="p-2 border rounded-md bg-white flex-1"
				/>
			</div>
			<div className="flex flex-col gap-2 mx-10 mt-4">
				{filtered.map((faq) => (
					<div
						key={faq.id}
						className="bg-white rounded-md shadow overflow-hidden"
					>
						<button
							onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
							className="w-full flex items-center justify-between p-4 text-left"
						>
							<p className="text-lg wrap-break-word">{faq.question}</p>
							<ChevronDown
								size={18}
								className={`transition-transform shrink-0 ml-2 ${openId === faq.id ? "rotate-180" : ""}`}
							/>
						</button>
						{openId === faq.id && (
							<div className="px-4 pb-4 text-gray-700 border-t pt-3">
								<p className="wrap-break-word">{faq.answer}</p>
								{isAdmin && (
									<div className="flex flex-row justify-end gap-2">
										<a
											href={`/faq/${faq.id}/edit`}
											className="px-3 py-1 text-sm border rounded-md shadow-md"
										>
											Redigera
										</a>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
