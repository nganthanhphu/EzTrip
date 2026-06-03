function resolveFieldName(field) {
	if (typeof field === "string") {
		return field;
	}

	return field?.name || "";
}

function resolveFieldLabel(field) {
	if (typeof field === "string") {
		return field;
	}

	return field?.label || field?.name || "";
}

export function isEmptyValue(value) {
	return value === undefined || value === null || value === "";
}

export function validateRequiredFields(values, fields, options = {}) {
	const messagePrefix = options.messagePrefix || "Vui lòng nhập";
	const messageSuffix = options.messageSuffix || "!";

	for (const field of fields || []) {
		const fieldName = resolveFieldName(field);
		if (!fieldName || !isEmptyValue(values?.[fieldName])) {
			continue;
		}

		const fieldLabel = resolveFieldLabel(field);
		return {
			valid: false,
			field: fieldName,
			message: `${messagePrefix} ${fieldLabel}${messageSuffix}`,
		};
	}

	return {
		valid: true,
		field: "",
		message: "",
	};
}

export function validatePasswordConfirmation(password, confirmPassword, message = "Mật khẩu KHÔNG khớp!") {
	return {
		valid: password === confirmPassword,
		message,
	};
}
