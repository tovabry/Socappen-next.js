import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { FaqList } from "@/components/faq/FaqList";

type JwtPayload = { roles: string[]; sub: string; exp: number };

interface ResponseFaq {
	id: number;
	question: string;
	answer: string;
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

	// SÄTTER SIZE SOM 30 FÖR ATT UNDVIKA PROBLEMET MED ATT DET BARA HÄMTAR 10 FAQS SOM ÄR SATT SOM DEFAULT I BACKEND OCH SEDAN INTE VISAR NÅGRA FLER
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq?size=30`);
	const data = await res.json();
	const faqs: ResponseFaq[] = data.content ?? data;

	return <FaqList faqs={faqs} isAdmin={isAdmin} />;
}
