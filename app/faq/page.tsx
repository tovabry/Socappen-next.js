import { FaqList } from "@/components/faq/FaqList";
import { hasPermission } from "@/lib/getPermissions";
import { getRoles } from "@/lib/getRole";
import { serverFetch } from "@/lib/serverFetch";

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
}

interface FaqPageProps {
	searchParams?: Promise<{
		page?: string;
	}>;
}

const PAGE_SIZE = 30;

export default async function FaqPage({ searchParams }: FaqPageProps) {
	const params = await searchParams;
	const page = Math.max(0, Number(params?.page ?? 0));

	const hasFaqPermissions = await hasPermission("manage_faq");

	const [{ isAdmin }, res] = await Promise.all([
		getRoles(),
		serverFetch(
			`${process.env.NEXT_PUBLIC_API_URL}/faq?page=${page}&size=${PAGE_SIZE}`,
			{
				next: { revalidate: 1200 },
			},
		),
	]);
	if (!res.ok) {
		console.error("FAQ fetch failed:", res.status, await res.text());
		return <div>Kunde inte hämta FAQ.</div>;
	}

	const data = await res.json();
	const faqs: ResponseFaq[] = data.content ?? data;
	const hasNextPage = faqs.length === PAGE_SIZE;

	return (
		<FaqList
			faqs={faqs}
			isAdmin={isAdmin}
			hasFaqPermissions={hasFaqPermissions}
			page={page}
			hasNextPage={hasNextPage}
		/>
	);
}
