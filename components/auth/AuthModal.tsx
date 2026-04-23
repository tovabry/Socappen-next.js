"use client";

import LoginForm from "./LoginForm";
import { X } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
	const { user, logout } = useAuth();
	const router = useRouter();

	if (!open) return null;

	const handleLogout = async () => {
		await logout();
		onClose();
		router.push("/home");
		router.refresh();
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 w-full max-w-sm relative">
				<button
					onClick={onClose}
					className="absolute top-3 right-3"
					aria-label="Close login window"
				>
					<X />
				</button>
				{user ? (
					<div className="flex flex-col items-center">
						<p className="mb-4 text-lg">Du är inloggad som: {user?.email}</p>
						<button
							onClick={handleLogout}
							className="border rounded-lg px-4 py-2 bg-(--bg-secondary-color-red) text-white"
						>
							Logga ut
						</button>
					</div>
				) : (
					<LoginForm onSuccess={onClose} />
				)}
			</div>
		</div>
	);
}
