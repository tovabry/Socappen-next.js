"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { ArrowLeft, ArrowRight, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

interface Props {
	faqs: ResponseFaq[];
	isAdmin: boolean;
	hasFaqPermissions: boolean;
	page: number;
	hasNextPage: boolean;
}

export function FaqList({
	faqs,
	isAdmin,
	hasFaqPermissions,
	page,
	hasNextPage,
}: Props) {
	const [searchQuery, setSearchQuery] = useState("");
	const [openId, setOpenId] = useState<number | null>(null);

	const filtered = faqs.filter((faq) =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
	);
	const reversed = [...filtered].reverse(); // Reversed to show newest first since FAQ doesn't have createdAt

	return (
		<div className="w-full">
			<Header title="Vanligt förekommande frågor" backRouteLink="/home" />
			<div className="flex items-center gap-4 mx-10 mt-5 flex-col md:flex-col">
				<input
					onChange={(e) => setSearchQuery(e.target.value)}
					type="text"
					placeholder="Sök..."
					className="p-2 border rounded-md bg-white flex-1 lg:min-w-150 shadow-md"
				/>
				{isAdmin && hasFaqPermissions && (
					<Link
						href="/faq/new"
						className="px-4 py-2 bg-(--accent-lightblue) text-white rounded-md text-md whitespace-nowrap flex flex-row items-center gap-1"
					>
						<Plus aria-hidden="true" /> Lägg till ny FAQ
					</Link>
				)}
			</div>
			<main className="flex flex-col gap-2 mx-10 mt-4 md:w-2/3 md:mx-auto">
				{reversed.map((faq) => (
					<div
						key={faq.id}
						className="bg-white rounded-md shadow overflow-hidden"
					>
						<button
							onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
							className="w-full flex items-center justify-between p-4 text-left"
							aria-label={`Visa svar för: ${faq.question}`}
							aria-expanded={openId === faq.id}
						>
							<div>
								<p className="text-sm text-gray-700">Fråga:</p>
								<p className="text-lg wrap-break-word">{faq.question}</p>
							</div>
							<ChevronDown
								size={18}
								className={`transition-transform shrink-0 ml-2 ${openId === faq.id ? "rotate-180" : ""}`}
							/>
						</button>
						{openId === faq.id && (
							<div className="px-4 pb-4 text-gray-700 border-t pt-3">
								<p className="text-sm text-gray-700">Svar:</p>
								<p className="wrap-break-word text-lg">{faq.answer}</p>
								{isAdmin && hasFaqPermissions && (
									<div className="flex flex-row justify-end gap-2">
										<Link
											href={`/faq/${faq.id}/edit`}
											aria-label={`Redigera FAQ: ${faq.question}`}
											className="px-3 py-1 text-sm border rounded-md shadow-md"
										>
											Redigera
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</main>
			<div className="flex justify-center gap-4 mt-6 mb-8">
				{page > 0 && (
					<Link
						href={`/faq?page=${page - 1}`}
						className="px-4 py-2 bg-(--accent-lightblue) text-white rounded-md"
					>
						<ArrowLeft aria-hidden="true" aria-label="Föregående" />
					</Link>
				)}

				{hasNextPage && (
					<Link
						href={`/faq?page=${page + 1}`}
						className="px-4 py-2 bg-(--accent-lightblue) text-white rounded-md"
					>
						<ArrowRight aria-hidden="true" aria-label="Nästa" />
					</Link>
				)}
			</div>
		</div>
	);
}
