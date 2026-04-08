"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import { X } from "lucide-react";
import { getToken, removeToken } from "@/lib/auth";

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
}
interface ResponseUser {
	email: string;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
	if (!open) return null;
	const token = getToken();
	const [user, setUser] = useState<string>("Guest");

	const handleLogout = () => {
		removeToken();
		window.dispatchEvent(new Event("auth-change"));
		onClose();
	};

	fetch("http://localhost:8080/api/users/me", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
		.then((res) => res.json())
		.then((data: ResponseUser) => setUser(data.email))
		.catch(() => setUser("anonymous user"));

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
				{token ? (
					<div className="flex flex-col items-center">
						<p className="mb-4 text-lg">Du är inloggad som: {user}</p>
						<button
							onClick={handleLogout}
							className="border rounded-lg px-4 py-2 bg-[#f87171] text-white"
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
