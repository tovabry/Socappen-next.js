"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "../../components/QuestionCard";
import { Header } from "@/components/Header";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

export default function FaqPage() {
	const [faqs, setFaqs] = useState<ResponseFaq[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		fetch("http://localhost:8080/api/faq")
			.then((res) => res.json())
			.then((data: ResponseFaq[]) => setFaqs(data))
			.catch((err) => {
				console.error("Failed to fetch FAQs:", err);
				setFaqs([]);
			});
	}, []);

	const searchFilter = (array: ResponseFaq[]) => {
		return array.filter((el) =>
			el.question.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	};

	const filtered = searchFilter(faqs);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
	};

	return (
		<div className="w-full">
			<Header title="Vanligt förekommande frågor" backRouteLink="/home" />
			<input
				onChange={handleChange}
				type="text"
				placeholder="Sök..."
				className="p-2 border rounded-md mx-10 mt-5 bg-white w-[calc(100%-80px)]"
			/>
			<ul>
				{filtered.map((faq) => (
					<li key={faq.id}>
						<QuestionCard
							question={faq.question}
							routeLink={`/faq/${faq.id}`}
						/>
					</li>
				))}
			</ul>
		</div>
	);
}
