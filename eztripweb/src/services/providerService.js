import axiosClient from "@services/axiosClient";

const requestList = async (endpoint, params = {}) => {
    const response = await axiosClient.get(endpoint, { params });
    return response.data;
};

export async function getAccommodations(params = {}) {
    return requestList("/api/accommodations", params);
}

export async function getTransportations(params = {}) {
    return requestList("/api/transportations", params);
}

export async function getTourisms(params = {}) {
    return requestList("/api/tourisms", params);
}

export async function getProviderServices(params = {}) {
    const [accommodations, transportations, tourisms] = await Promise.all([
        getAccommodations(params),
        getTransportations(params),
        getTourisms(params),
    ]);

    return [
        ...accommodations,
        ...transportations,
        ...tourisms,
    ];
}

export async function getBookings(params = {}) {
    return requestList("/api/secure/bookings", params);
}

export async function updateBooking(bookingId, booking) {
    return axiosClient.patch(`/api/secure/bookings/${bookingId}`, booking);
}

export default {
    getAccommodations,
    getTransportations,
    getTourisms,
    getProviderServices,
    getBookings,
    updateBooking,
};

