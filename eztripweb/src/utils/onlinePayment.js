import { getBookings, payBooking } from "@services/customerService";

const MOMO_PAYMENT_METHOD_ID = 2;

function isMatchingBooking(booking, expected) {
	if (!booking || !expected) {
		return false;
	}

	const bookingPaymentMethod = Number(booking.paymentMethod ?? booking.paymentMethodId);
	const bookingQuantity = Number(booking.quantity);
	const expectedQuantity = Number(expected.quantity);

	return booking.serviceName === expected.serviceName
		&& booking.bookingDay === expected.bookingDay
		&& booking.note === expected.note
		&& bookingPaymentMethod === Number(expected.paymentMethodId ?? MOMO_PAYMENT_METHOD_ID)
		&& bookingQuantity === expectedQuantity;
}

export function buildMomoRedirectUrl() {
	return `${window.location.origin}/history`;
}

export async function openMomoPaymentForBooking(expectedBooking) {
	const response = await getBookings({ page: 1 });
	const bookings = response || [];
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