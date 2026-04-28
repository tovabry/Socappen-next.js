import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
	roles: string[];
	sub: string;
	exp: number;
};

export function proxy(request: NextRequest) {
	const token = request.cookies.get("token")?.value;
	const { pathname } = request.nextUrl;

	// No token → redirect to login
	if (!token) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const decoded = jwtDecode<JwtPayload>(token);

		// Token expired → redirect to login
		if (decoded.exp * 1000 < Date.now()) {
			return NextResponse.redirect(new URL("/login", request.url));
		}

		// Sysadmin only routes
		if (
			pathname.startsWith("/sysadmin") &&
			!decoded.roles.includes("ROLE_SYSADMIN")
		) {
			return NextResponse.redirect(new URL("/home", request.url));
		}

		// sysadmin and admin routes
		if (
			pathname.startsWith("/admin") &&
			!decoded.roles.some((r) => ["ROLE_ADMIN", "ROLE_SYSADMIN"].includes(r))
		) {
			return NextResponse.redirect(new URL("/home", request.url));
		}

		return NextResponse.next();
	} catch {
		// Invalid token → redirect to login
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

export const config = {
	matcher: ["/sysadmin/:path*", "/admin/:path*", "/logs/:path*"],
};
