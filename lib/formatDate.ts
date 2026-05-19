/**
 * @returns A formatted date string in the Swedish format "YYYY-MM-DD HH:mm".
 */
export function formatDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleString("sv-SE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatTime(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleTimeString("sv-SE", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatOnlyDate(dateString: string) {
	const date = new Date(dateString);
	return date.toLocaleDateString("sv-SE", {
		month: "2-digit",
		day: "2-digit",
	});
}
