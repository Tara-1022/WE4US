export function isDateInFuture(dateString: string): boolean {
    if (!dateString) return true;

    const selectedDate = new Date(dateString);
    const today = new Date();

    today.setHours(23, 59, 59, 999);

    return selectedDate >= today;
}

export function formatToN(s: string, n: number) {
    if (s.length <= n) return s;
    return s.slice(0, n - 2) + "..";
}