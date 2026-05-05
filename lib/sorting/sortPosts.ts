export function sortPostsByNewest<
	T extends { createdAt: string; updatedAt?: string },
>(posts: T[]): T[] {
	return [...posts].sort((a, b) => {
		const dateA = new Date(a.updatedAt ?? a.createdAt).getTime();
		const dateB = new Date(b.updatedAt ?? b.createdAt).getTime();
		return dateB - dateA;
	});
}
