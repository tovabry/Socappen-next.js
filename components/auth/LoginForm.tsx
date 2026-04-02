"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
	onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

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
			const res = await fetch("http://localhost:8080/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: form.email, password: form.password }),
			});

			if (!res.ok) {
				setError("Ogiltig e-post eller lösenord.");
				return;
			}

			const { token } = await res.json();
			localStorage.setItem("token", token);
			onSuccess ? onSuccess() : router.push("/home");
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
