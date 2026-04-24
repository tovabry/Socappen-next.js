import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { Header } from "@/components/Header";
import { ContactList } from "@/components/contact/ContactList";

type JwtPayload = { roles: string[]; sub: string; exp: number };

interface ContactResponse {
	id: number;
	title: string;
	imgUrl: string;
	mail: string;
	phone: string;
}

export default async function FaqPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	let isAdmin = false;
	if (token) {
		try {
			const decodedToken = jwtDecode<JwtPayload>(token);
			isAdmin = decodedToken.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			);
		} catch {
			console.error("Invalid token");
		}
	}

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`);
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

	return <ContactList contacts={contacts} isAdmin={isAdmin} />;
}
