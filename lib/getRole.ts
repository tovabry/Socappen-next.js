import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { roles: string[]; sub: string; exp: number };

export async function getRoles(): Promise<{
	isUser: boolean;
	isAdmin: boolean;
	isSysAdmin: boolean;
}> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	if (!token) return { isUser: false, isAdmin: false, isSysAdmin: false };
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		return {
			isUser: decoded.roles.includes("ROLE_USER"),
			isAdmin: decoded.roles.some((r) =>
				["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
			),
			isSysAdmin: decoded.roles.includes("ROLE_SYSADMIN"),
		};
	} catch {
		return { isUser: false, isAdmin: false, isSysAdmin: false };
	}
}
