export function isDateInFuture(dateString: string): boolean {
    if (!dateString) return true;

    const selectedDate = new Date(dateString);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return selectedDate >= today;
}