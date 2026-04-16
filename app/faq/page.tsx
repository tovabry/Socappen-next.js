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

	const res = await fetch("http://localhost:8080/api/faq");
	const faqs: ResponseFaq[] = await res.json();

	return <FaqList faqs={faqs} isAdmin={isAdmin} />;
}
