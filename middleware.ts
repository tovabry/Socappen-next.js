import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    role: "user" | "admin" | "sysadmin";
    sub: string;
    exp: number;
};

export function middleware(request: NextRequest) {
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
        if (pathname.startsWith("/sysadmin") && decoded.role !== "sysadmin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Admin and sysadmin only routes
        if (pathname.startsWith("/admin") && !["admin", "sysadmin"].includes(decoded.role)) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();

    } catch (e) {
        // Invalid token → redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

// Which routes middleware runs on
export const config = {
    matcher: [
        "/sysadmin/:path*",
        "/admin/:path*",
    ]
}