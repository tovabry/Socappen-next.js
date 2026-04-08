"use client";

import { useState } from "react";
import React from "react";

interface RegisterRequest {
	email: string;
	password: string;
}

interface ResponseAppUser {
	id: number;
	email: string;
	status: string;
	role: string;
	online: boolean;
}

interface FieldErrors {
	email?: string;
	password?: string;
	confirmPassword?: string;
	general?: string;
}

export default function SignupPage() {
	const [form, setForm] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState<ResponseAppUser | null>(null);

	const validate = (): boolean => {
		const newErrors: FieldErrors = {};

		if (!form.email.trim()) {
			newErrors.email = "Email is required.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			newErrors.email = "Enter a valid email address.";
		}

		if (!form.password) {
			newErrors.password = "Password is required.";
		} else if (form.password.length < 8) {
			newErrors.password = "Must be at least 8 characters.";
		}

		if (!form.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password.";
		} else if (form.password !== form.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validate()) return;

		setLoading(true);

		const payload: RegisterRequest = {
			email: form.email,
			password: form.password,
		};

		try {
			const res = await fetch("http://localhost:8080/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const text = await res.text();
				setErrors({
					general: text || "Registration failed. Please try again.",
				});
				return;
			}

			const data: ResponseAppUser = await res.json();
			setSuccess(data);
		} catch {
			setErrors({ general: "Network error. Is the server running?" });
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="auth-page">
				<div className="auth-card">
					<h2 className="text-xl font-semibold mb-2">Account created</h2>
					<p className="text-sm text-gray-500 mb-4">
						Welcome, <strong>{success.email}</strong>. Your account is active.
					</p>
					<a href="/home" className="text-sm text-gray-900 hover:underline">
						Fortsätt
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h2 className="text-xl font-semibold mb-1">Skapa ett konto</h2>
				<p className="text-sm text-gray-400 mb-6">
					Har du redan ett konto?{" "}
					<a href="/login" className="text-gray-900 hover:underline">
						Logga in
					</a>
				</p>

				{errors.general && (
					<div className="auth-error-banner">{errors.general}</div>
				)}

				<form onSubmit={handleSubmit} noValidate>
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
							className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
						/>
						{errors.email && (
							<span className="text-xs text-red-500 mt-1">{errors.email}</span>
						)}
					</div>

					<div className="auth-field">
						<label htmlFor="password" className="auth-label">
							Lösenord
						</label>
						<input
							id="password"
							name="password"
							type="password"
							autoComplete="new-password"
							placeholder="Minst 8 tecken"
							value={form.password}
							onChange={handleChange}
							className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
						/>
						{errors.password && (
							<span className="text-xs text-red-500 mt-1">
								{errors.password}
							</span>
						)}
					</div>

					<div className="auth-field">
						<label htmlFor="confirmPassword" className="auth-label">
							Bekräfta
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							autoComplete="new-password"
							placeholder="Upprepa lösenordet"
							value={form.confirmPassword}
							onChange={handleChange}
							className={`auth-input ${errors.confirmPassword ? "auth-input-error" : ""}`}
						/>
						{errors.confirmPassword && (
							<span className="text-xs text-red-500 mt-1">
								{errors.confirmPassword}
							</span>
						)}
					</div>

					<button type="submit" disabled={loading} className="auth-button">
						{loading ? "Skapar konto..." : "Registrera konto"}
					</button>
				</form>
			</div>
		</div>
	);
}
