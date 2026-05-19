"use client";
import { useAuth } from "@/lib/context/AuthContext";

export function WelcomeMessage() {
	const { user, loading } = useAuth();
	return (
		<h2 className="flex items-center gap-2 text-white my-4 text-lg font-semibold">
			Välkommen! {loading ? "" : (user?.email ?? "Gäst")}
		</h2>
	);
}
