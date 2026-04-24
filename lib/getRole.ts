import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { roles: string[]; sub: string; exp: number };

export async function getIsAdmin(): Promise<boolean> {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;
	if (!token) return false;
	try {
		const decoded = jwtDecode<JwtPayload>(token);
		return decoded.roles.some((r) =>
			["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r),
		);
	} catch {
		return false;
	}
}
