import { NextResponse } from "next/server";

const ENEO_BASE_URL = process.env.ENEO_BASE_URL;
const ENEO_API_KEY = process.env.ENEO_API_KEY;
const ENEO_ASSISTANT_ID = process.env.ENEO_ASSISTANT_ID;

export async function POST(request: Request) {
	try {
		if (!ENEO_BASE_URL || !ENEO_API_KEY || !ENEO_ASSISTANT_ID) {
			return NextResponse.json(
				{ error: "Missing AI environment variables" },
				{ status: 500 },
			);
		}

		const body = await request.json().catch(() => null);
		const message = body?.message?.toString().trim();
		const sessionId = body?.sessionId?.toString().trim();

		const url = sessionId
			? `${ENEO_BASE_URL}/api/v1/assistants/${ENEO_ASSISTANT_ID}/sessions/${sessionId}/?version=1`
			: `${ENEO_BASE_URL}/api/v1/assistants/${ENEO_ASSISTANT_ID}/sessions/?version=1`;

		if (!message) {
			return NextResponse.json(
				{ error: "message is required" },
				{ status: 400 },
			);
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15000);

		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				"X-API-Key": ENEO_API_KEY,
			},
			body: JSON.stringify({
				question: message,
				stream: false,
			}),
			signal: controller.signal,
		});
		clearTimeout(timeout);

		if (!res.ok) {
			const text = await res.text();
			return NextResponse.json(
				{ error: "AI request failed", details: text },
				{ status: res.status },
			);
		}

		const data = await res.json();
		const reply =
			data?.answer ?? data?.message ?? "Inget svar från AI-assistenten.";

		return NextResponse.json({
			reply,
			session_id: data?.session_id ?? sessionId ?? null,
		});
	} catch (error) {
		const isAbort = error instanceof Error && error.name === "AbortError";
		return NextResponse.json(
			{ error: isAbort ? "AI request timed out" : "Unexpected AI route error" },
			{ status: 500 },
		);
	}
}
