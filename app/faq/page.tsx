import { FaqList } from "@/components/faq/FaqList";
import { getRoles } from "@/lib/getRole";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

export default async function FaqPage() {
	console.log("FAQ fetch at:", new Date().toISOString());
	const [{ isAdmin }, res] = await Promise.all([
		getRoles(),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq?size=30`, {
			next: { revalidate: 300 }, // 5 minutes caching
		}),
	]);

	const data = await res.json();
	const faqs: ResponseFaq[] = data.content ?? data;

	return <FaqList faqs={faqs} isAdmin={isAdmin} />;
}
