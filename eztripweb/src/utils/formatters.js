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

export function formatDateTime(value) {
	if (!value) {
		return "";
	}

	if (typeof value === "string") {
		return value;
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return String(value);
	}

	return new Intl.DateTimeFormat("vi-VN", {
		dateStyle: "short",
		timeStyle: "short",
	}).format(date);
}

export function formatBookingDate(dateValue) {
    if (!dateValue) {
        return "";
    }

    const [year, month, day] = dateValue.split("-");
    return `${day}/${month}/${year}`;
}

export default formatCurrency;