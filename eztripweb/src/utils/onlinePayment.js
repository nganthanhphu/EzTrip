import customerService from "@services/customerService";

const PAYMENT_STRATEGIES = {
    2: {
        name: "Momo",
        buildRedirectUrl: () => `${window.location.origin}/history`,
    },
    3: {
        name: "Chuyển khoản ngân hàng",
        buildRedirectUrl: () => `${window.location.origin}/history`,
    },
    4: {
        name: "ZaloPay",
        buildRedirectUrl: () => `${window.location.origin}/history`,
    },
    5: {
        name: "VNPay",
        buildRedirectUrl: () => `${window.location.origin}/history`,
    }
};

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
        && bookingPaymentMethod === Number(expected.paymentMethodId)
        && bookingQuantity === expectedQuantity;
}

export async function processOnlinePayment(expectedBooking) {
    const methodId = Number(expectedBooking.paymentMethodId);
    const strategy = PAYMENT_STRATEGIES[methodId];

    if (!strategy) {
        throw new Error(`Hệ thống chưa hỗ trợ phương thức thanh toán này (Mã: ${methodId}).`);
    }

    const response = await customerService.getBookings({ page: 1 });
    const bookings = response || [];
    const booking = bookings.find((item) => isMatchingBooking(item, expectedBooking));

    if (!booking?.id) {
        throw new Error(`Không tìm thấy giao dịch vừa tạo để tiến hành thanh toán qua ${strategy.name}.`);
    }

    const paymentResponse = await customerService.payBooking(booking.id, {
        redirectUrl: strategy.buildRedirectUrl(),
    });
    
    const paymentUrl = paymentResponse?.paymentUrl || paymentResponse?.data?.paymentUrl;

    if (!paymentUrl) {
        throw new Error(`Hệ thống đối tác ${strategy.name} từ chối tạo liên kết thanh toán.`);
    }

    window.location.assign(paymentUrl);
    return paymentUrl;
}