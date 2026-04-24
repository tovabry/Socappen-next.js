"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/lib/auth";
import { useAuth } from "@/lib/context/AuthContext";

interface LoginFormProps {
	onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { setUser } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: form.email, password: form.password }),
				credentials: "include",
			});

			if (!res.ok) {
				setError("Ogiltig e-post eller lösenord.");
				return;
			}

			const user = await fetchCurrentUser();
			setUser(user);
			if (onSuccess) {
				onSuccess();
				router.refresh();
			} else {
				router.push("/home");
				router.refresh();
			}
		} catch {
			setError("Något gick fel, försök igen.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="auth-card">
			<h2 className="text-xl font-semibold mb-1">Logga in</h2>
			<p className="text-sm text-gray-400 mb-6">
				Har du inget konto?{" "}
				<a href="/login/signup" className="text-gray-900 hover:underline">
					Skapa ett konto
				</a>
			</p>

			{error && <div className="auth-error-banner">{error}</div>}

			<form onSubmit={handleLogin} noValidate>
				<div className="auth-field">
					<label htmlFor="email" className="auth-label">
						E-post
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						placeholder="namn@exempel.com"
						value={form.email}
						onChange={handleChange}
						className="auth-input"
						required
						aria-required="true"
					/>
				</div>

				<div className="auth-field">
					<label htmlFor="password" className="auth-label">
						Lösenord
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						placeholder="Ditt lösenord"
						value={form.password}
						onChange={handleChange}
						className="auth-input"
						required
						aria-required="true"
					/>
				</div>

				<button type="submit" disabled={loading} className="auth-button">
					{loading ? "Loggar in..." : "Logga in"}
				</button>
			</form>
		</div>
	);
}
