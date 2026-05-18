import { ContactList } from "@/components/contact/ContactList";
import { hasPermission } from "@/lib/getPermissions";
import { getRoles } from "@/lib/getRole";

interface ContactResponse {
	id: number;
	title: string;
	imgUrl: string;
	mail: string;
	phone: string;
}

export default async function ContactsPage() {
	const hasContactPermissions = await hasPermission("manage_contact");
	const [{ isAdmin }, res] = await Promise.all([
		getRoles(),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
			next: { revalidate: 1200 }, // 20 minutes caching
		}),
	]);
	if (!res.ok) {
		console.error("Contacts fetch failed:", res.status, await res.text());
		return <div>Kunde inte hämta kontakter.</div>;
	}
	const data = await res.json();
	const contacts: ContactResponse[] = Array.isArray(data)
		? data
		: Array.isArray(data.content)
			? data.content
			: [];

	return (
		<ContactList
			contacts={contacts}
			isAdmin={isAdmin}
			hasContactPermissions={hasContactPermissions}
		/>
	);
}
