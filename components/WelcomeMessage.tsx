"use client";
import { useAuth } from "@/lib/context/AuthContext";

interface Props {
	roleLabel: string | null;
}

export function WelcomeMessage({ roleLabel }: Props) {
	const { user, loading } = useAuth();
	return (
		<h2 className="flex items-center gap-2 text-white mx-12 my-4 text-lg font-semibold">
			Välkommen! {loading ? "" : (user?.email ?? "Gäst")}
			{roleLabel && (
				<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">
					{roleLabel}
				</span>
			)}
		</h2>
	);
}
