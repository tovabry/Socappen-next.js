"use client";

import Link from "next/link";
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
		<>
			<header className="sticky top-0 z-50 bg-(--bg-secondary-color-red) border-b border-white/15">
				<div className="mx-auto max-w-6xl px-3 py-2">
					<div className="grid grid-cols-[40px_1fr_40px] sm:grid-cols-[auto_1fr_auto] items-center gap-2">
						{backRouteLink ? (
							<Link
								href={backRouteLink}
								aria-label="Gå tillbaka"
								className="inline-flex h-10 w-10 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-md sm:px-3 sm:py-2 text-sm font-medium text-white hover:bg-white/10"
							>
								<ArrowLeft size={20} aria-hidden="true" />
								<span className="hidden sm:inline">Bakåt</span>
							</Link>
						) : (
							<div className="h-10 w-10" aria-hidden="true" />
						)}

						<h1 className="truncate text-center text-base sm:text-lg md:text-xl font-semibold text-white">
							{title}
						</h1>

						<button
							type="button"
							onClick={() => setAuthOpen(true)}
							aria-label="Öppna konto"
							className="inline-flex h-10 w-10 sm:h-auto sm:w-auto items-center justify-center gap-2 rounded-md sm:px-3 sm:py-2 text-sm font-medium text-white hover:bg-white/10 cursor-pointer"
						>
							<User size={20} aria-hidden="true" />
							<span className="hidden sm:inline">Konto</span>
						</button>
					</div>
				</div>
			</header>

			<AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
		</>
	);
}
