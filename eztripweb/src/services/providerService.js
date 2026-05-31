import axiosClient from "@services/axiosClient";
import commonService from "@services/commonService";

const requestList = async (endpoint, params = {}) => {
    const response = await axiosClient.get(endpoint, { params });
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
    return commonService.getAccommodations(params);
}

export async function getAccommodationById(id) {
    return commonService.getAccommodationById(id);
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

export async function getTransportations(params = {}) {
    return commonService.getTransportations(params);
}

export async function createTransportation(transportation) {
    return requestMultipartCreate("/api/secure/transportations", transportation);
}

export async function getTransportationById(id) {
    return commonService.getTransportationById(id);
}

export async function updateTransportation(id, transportation) {
    return requestMultipartUpdate("/api/secure/transportations", id, transportation);
}

export async function deleteTransportation(id) {
    return axiosClient.delete(`/api/secure/transportations/${id}`);
}

export async function getTourisms(params = {}) {
    return commonService.getTourisms(params);
}

export async function createTourism(tourism) {
    return requestMultipartCreate("/api/secure/tourisms", tourism);
}

export async function getTourismById(id) {
    return commonService.getTourismById(id);
}

export async function updateTourism(id, tourism) {
    return requestMultipartUpdate("/api/secure/tourisms", id, tourism);
}

export async function deleteTourism(id) {
    return axiosClient.delete(`/api/secure/tourisms/${id}`);
}

export async function deleteServiceByType(serviceType, id) {
    const deletions = {
        ACCOMMODATION: deleteAccommodation,
        TRANSPORTATION: deleteTransportation,
        TOURISM: deleteTourism,
    };

    const deleter = deletions[serviceType];
    if (!deleter) {
        throw new Error("Loại dịch vụ không hợp lệ.");
    }

    return deleter(id);
}

export async function getServiceById(id) {
    const serviceFetchers = [
        { type: "ACCOMMODATION", fetcher: getAccommodationById },
        { type: "TRANSPORTATION", fetcher: getTransportationById },
        { type: "TOURISM", fetcher: getTourismById },
    ];

    for (const item of serviceFetchers) {
        try {
            const service = await item.fetcher(id);
            return { type: item.type, service };
        } catch (error) {
            if (error?.response?.status !== 404) {
                throw error;
            }
        }
    }

    return null;
}

export async function updateServiceByType(serviceType, id, payload) {
    const updates = {
        ACCOMMODATION: updateAccommodation,
        TRANSPORTATION: updateTransportation,
        TOURISM: updateTourism,
    };

    const updater = updates[serviceType];
    if (!updater) {
        throw new Error("Loại dịch vụ không hợp lệ.");
    }

    return updater(id, payload);
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

export async function getReviewsByServiceId(serviceId, params = {}) {
    return commonService.getReviewsByServiceId(serviceId, params);
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
    deleteServiceByType,
    getProviderServices,
    getServiceById,
    updateServiceByType,
    deleteImage,
    getBookings,
    updateBooking,
};

export default providerService;

