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

export function formatTimestamp(value) {
    if (!value) {
        return "";
    }

    try {
        return new Date(value).toLocaleString("vi-VN");
    } catch {
        return "";
    }
}

export function backendDobToInput(value) {
    if (!value) return "";
    const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
    const dmy = value.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
    if (dmy) return `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
    const parsed = new Date(value);
    if (!isNaN(parsed.getTime())) {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, "0");
        const d = String(parsed.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }
    return "";
}

export default formatCurrency;