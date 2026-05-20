"use client";
import { useAuth } from "@/lib/context/AuthContext";

export function WelcomeMessage() {
	const { user, loading } = useAuth();
	return (
		<h2 className="min-w-0 flex-1 text-white my-4 text-lg font-semibold wrap-break-word">
			Välkommen! {loading ? "" : (user?.email ?? "Gäst")}
		</h2>
	);
}
