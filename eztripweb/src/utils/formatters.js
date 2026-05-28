export function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatHour(value) {
    if (value === null || value === undefined || value === "") {
        return "--:--";
    }

    const parsedValue = Number(value);
    if (Number.isNaN(parsedValue)) {
        return String(value);
    }

    return `${String(parsedValue).padStart(2, "0")}:00`;
}

export default formatCurrency;