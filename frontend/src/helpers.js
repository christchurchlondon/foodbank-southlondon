
export function capitalise(text) {
    return text.charAt(0).toUpperCase(0) + text.slice(1);
}

export function today() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}
