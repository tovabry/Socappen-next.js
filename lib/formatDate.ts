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
