import { FaqList } from "@/components/faq/FaqList";
import { hasPermission } from "@/lib/getPermissions";
import { getRoles } from "@/lib/getRole";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

export default async function FaqPage() {
	console.log("FAQ fetch at:", new Date().toISOString());
	const hasFaqPermissions = await hasPermission("manage_faq");
	const [{ isAdmin }, res] = await Promise.all([
		getRoles(),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq?size=30`, {
			next: { revalidate: 1200 }, // 20 minutes caching
		}),
	]);
	if (!res.ok) {
		console.error("FAQ fetch failed:", res.status, await res.text());
		return <div>Kunde inte hämta FAQ.</div>;
	}

	const data = await res.json();
	const faqs: ResponseFaq[] = data.content ?? data;

	return (
		<FaqList
			faqs={faqs}
			isAdmin={isAdmin}
			hasFaqPermissions={hasFaqPermissions}
		/>
	);
}
