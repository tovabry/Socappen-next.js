"use client";

import { useState } from "react";
import { QuestionCard } from "../QuestionCard";
import { Header } from "@/components/Header";

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

	const filtered = faqs.filter((faq) =>
		faq.question.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	return (
		<div className="w-full">
			<Header title="Vanligt förekommande frågor" backRouteLink="/home" />
			<div className="flex items-center gap-4 mx-10 mt-5">
				<input
					onChange={(e) => setSearchQuery(e.target.value)}
					type="text"
					placeholder="Sök..."
					className="p-2 border rounded-md bg-white flex-1"
				/>
				{isAdmin && (
					<a
						href="/faq/new"
						className="px-4 py-2 bg-(--bg-secondary-color-red) text-white rounded-md text-sm whitespace-nowrap"
					>
						+ Lägg till ny FAQ
					</a>
				)}
			</div>
			<div className="flex flex-col gap-2 mx-10 md:grid md:grid-cols-2 lg:grid-cols-3">
				{filtered.map((faq) => (
					<QuestionCard
						key={faq.id}
						question={faq.question}
						routeLink={`/faq/${faq.id}`}
					/>
				))}
			</div>
		</div>
	);
}
