"use client";

import LoginForm from "./LoginForm";
import { X } from "lucide-react";

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
	if (!open) return null;

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
				<LoginForm onSuccess={onClose} />
			</div>
		</div>
	);
}
