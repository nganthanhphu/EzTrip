import { getBookings, payBooking } from "@services/customerService";

const MOMO_PAYMENT_METHOD_ID = 2;

function normalizeText(value) {
	return String(value ?? "")
		.trim()
		.toLowerCase();
}

function isMatchingBooking(booking, expected) {
	if (!booking || !expected) {
		return false;
	}

	const bookingPaymentMethod = Number(booking.paymentMethod ?? booking.paymentMethodId);
	const bookingQuantity = Number(booking.quantity);
	const expectedQuantity = Number(expected.quantity);

	return normalizeText(booking.serviceName) === normalizeText(expected.serviceName)
		&& normalizeText(booking.bookingDay) === normalizeText(expected.bookingDay)
		&& normalizeText(booking.note) === normalizeText(expected.note)
		&& bookingPaymentMethod === Number(expected.paymentMethodId ?? MOMO_PAYMENT_METHOD_ID)
		&& bookingQuantity === expectedQuantity;
}

export function buildMomoRedirectUrl() {
	return window.location.href;
}

export async function openMomoPaymentForBooking(expectedBooking) {
	const response = await getBookings({ page: 1 });
	const bookings = Array.isArray(response) ? response : response?.content || response?.items || response?.results || [];
	const booking = bookings.find((item) => isMatchingBooking(item, expectedBooking));

	if (!booking?.id) {
		throw new Error("Không tìm thấy booking vừa tạo để thanh toán Momo.");
	}

	const paymentResponse = await payBooking(booking.id, {
		redirectUrl: buildMomoRedirectUrl(),
	});
	const paymentUrl = paymentResponse?.paymentUrl || paymentResponse?.data?.paymentUrl;

	if (!paymentUrl) {
		throw new Error("Không thể tạo liên kết thanh toán Momo.");
	}

	window.location.assign(paymentUrl);
	return paymentUrl;
}