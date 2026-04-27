import { cookies } from "next/headers";
/**
 * A wrapper around fetch that includes cookies from the incoming request.
 * This is necessary for server-side rendering in Next.js, where you need to pass cookies to API routes or external services that require authentication.
 *
 * @param url - The URL to fetch.
 * @param options - Optional fetch options.
 * @returns A Promise that resolves to the Response object from the fetch call.
 */
export async function serverFetch(url: string, options?: RequestInit) {
	const cookieStore = await cookies();
	return fetch(url, {
		...options,
		headers: {
			Cookie: cookieStore.toString(),
			...options?.headers,
		},
	});
}
