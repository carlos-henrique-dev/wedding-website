export function formatDate(isoString?: string): string {
	if (!isoString) return '';

	const date = new Date(isoString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear().toString();

	return `${day} / ${month} / ${year}`;
}
