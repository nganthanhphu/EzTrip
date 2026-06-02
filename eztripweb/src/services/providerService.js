import axiosClient from "@services/axiosClient";

const requestList = async (endpoint, params = {}) => {
    const response = await axiosClient.get(endpoint, { params });
    return response.data;
};

const requestById = async (endpoint, id) => {
    const response = await axiosClient.get(`${endpoint}/${id}`);
    return response.data;
};

const requestMultipartCreate = async (endpoint, payload) => {
    return axiosClient.post(endpoint, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

const requestMultipartUpdate = async (endpoint, id, payload) => {
    return axiosClient.patch(`${endpoint}/${id}`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export async function getAccommodations(params = {}) {
    return requestList("/api/accommodations", params);
}

export async function getAccommodationById(id) {
    return requestById("/api/accommodations", id);
}

export async function getTransportations(params = {}) {
    return requestList("/api/transportations", params);
}

export async function getTransportationById(id) {
    return requestById("/api/transportations", id);
}

export async function getTourisms(params = {}) {
    return requestList("/api/tourisms", params);
}

export async function getTourismById(id) {
    return requestById("/api/tourisms", id);
}

export async function getReviewsByServiceId(serviceId, params = {}) {
    return requestList(`/services/${serviceId}/reviews`, { ...params, serviceId });
}

export async function createAccommodation(accommodation) {
    return requestMultipartCreate("/api/secure/accommodations", accommodation);
}

export async function updateAccommodation(id, accommodation) {
    return requestMultipartUpdate("/api/secure/accommodations", id, accommodation);
}

export async function deleteAccommodation(id) {
    return axiosClient.delete(`/api/secure/accommodations/${id}`);
}

export async function createTransportation(transportation) {
    return requestMultipartCreate("/api/secure/transportations", transportation);
}

export async function updateTransportation(id, transportation) {
    return requestMultipartUpdate("/api/secure/transportations", id, transportation);
}

export async function deleteTransportation(id) {
    return axiosClient.delete(`/api/secure/transportations/${id}`);
}

export async function createTourism(tourism) {
    return requestMultipartCreate("/api/secure/tourisms", tourism);
}

export async function updateTourism(id, tourism) {
    return requestMultipartUpdate("/api/secure/tourisms", id, tourism);
}

export async function deleteTourism(id) {
    return axiosClient.delete(`/api/secure/tourisms/${id}`);
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

export async function deleteImage(id) {
    return axiosClient.delete(`/api/secure/images/${id}`);
}

export async function getBookings(params = {}) {
    return requestList("/api/secure/bookings", params);
}

export async function updateBooking(bookingId, booking) {
    return axiosClient.patch(`/api/secure/bookings/${bookingId}`, booking);
}

export async function getStatistics(params = {}) {
    return requestList("/api/secure/stats", params);
}

const providerService = {
    getAccommodations,
    getAccommodationById,
    createAccommodation,
    updateAccommodation,
    deleteAccommodation,
    getTransportations,
    getTransportationById,
    createTransportation,
    updateTransportation,
    deleteTransportation,
    getTourisms,
    getTourismById,
    createTourism,
    updateTourism,
    deleteTourism,
    getProviderServices,
    deleteImage,
    getBookings,
    updateBooking,
    getReviewsByServiceId,
    getStatistics,
};

export default providerService;