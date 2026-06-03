import { apiHelper } from "@services/axiosClient";
import { endpoints } from "@configs/Apis";

export const providerService = {
    getAccommodations: (params) => apiHelper.get(endpoints.accommodations, params),
    getAccommodationById: (id) => apiHelper.get(`${endpoints.accommodations}/${id}`),
    createAccommodation: (data) => apiHelper.postForm(endpoints.secureAccommodations, data),
    updateAccommodation: (id, data) => apiHelper.patchForm(`${endpoints.secureAccommodations}/${id}`, data),
    deleteAccommodation: (id) => apiHelper.delete(`${endpoints.secureAccommodations}/${id}`),

    getTransportations: (params) => apiHelper.get(endpoints.transportations, params),
    getTransportationById: (id) => apiHelper.get(`${endpoints.transportations}/${id}`),
    createTransportation: (data) => apiHelper.postForm(endpoints.secureTransportations, data),
    updateTransportation: (id, data) => apiHelper.patchForm(`${endpoints.secureTransportations}/${id}`, data),
    deleteTransportation: (id) => apiHelper.delete(`${endpoints.secureTransportations}/${id}`),

    getTourisms: (params) => apiHelper.get(endpoints.tourisms, params),
    getTourismById: (id) => apiHelper.get(`${endpoints.tourisms}/${id}`),
    createTourism: (data) => apiHelper.postForm(endpoints.secureTourisms, data),
    updateTourism: (id, data) => apiHelper.patchForm(`${endpoints.secureTourisms}/${id}`, data),
    deleteTourism: (id) => apiHelper.delete(`${endpoints.secureTourisms}/${id}`),

    getProviderServices: async (params = {}) => {
        const [accommodations, transportations, tourisms] = await Promise.all([
            providerService.getAccommodations(params),
            providerService.getTransportations(params),
            providerService.getTourisms(params),
        ]);
        return [...accommodations, ...transportations, ...tourisms];
    },
    
    deleteImage: (id) => apiHelper.delete(`/api/secure/images/${id}`),
    getBookings: (params) => apiHelper.get(endpoints.bookings, params),
    updateBooking: (id, data) => apiHelper.patch(`${endpoints.bookings}/${id}`, data),
    getStatistics: (params) => apiHelper.get("/api/secure/stats", params),
    getReviewsByServiceId: (serviceId, params) => apiHelper.get(`/api/services/${serviceId}/reviews`, { ...params, serviceId }),
};

export default providerService;