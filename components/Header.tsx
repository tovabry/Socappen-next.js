"use client";
import { ArrowLeft, User } from "lucide-react";
import { useState } from "react";
import AuthModal from "./auth/AuthModal";

interface HeaderProps {
	title: string;
	backRouteLink?: string;
}

export function Header({ title, backRouteLink }: HeaderProps) {
	const [authOpen, setAuthOpen] = useState(false);
	return (
		<header className="bg-[#DF5E5E] shadow-lg p-2">
			<div className="flex flex-row items-center px-4 py-1">
				{backRouteLink && (
					<a href={backRouteLink || "/home"}>
						<ArrowLeft className="text-white" />
					</a>
				)}
				<h1 className="text-lg text-center text-white flex justify-around items-center w-full">
					{title}
				</h1>
				<button
					onClick={() => setAuthOpen(true)}
					className="text-white text-sm font-medium hover:underline"
				>
					<User />
				</button>
				<AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
			</div>
		</header>
	);
}
