import { apiHelper } from "@services/axiosClient";
import { endpoints } from "@configs/Apis";

const customerService = {
    getAccommodations: (params) => apiHelper.get(endpoints.accommodations, params),
    getAccommodationById: (id) => apiHelper.get(`${endpoints.accommodations}/${id}`),
    compareAccommodations: (params) => apiHelper.get(`${endpoints.accommodations}/compare`, params),

    getTourisms: (params) => apiHelper.get(endpoints.tourisms, params),
    getTourismById: (id) => apiHelper.get(`${endpoints.tourisms}/${id}`),
    compareTourisms: (params) => apiHelper.get(`${endpoints.tourisms}/compare`, params),

    getTransportations: (params) => apiHelper.get(endpoints.transportations, params),
    getBookings: (params) => apiHelper.get(endpoints.bookings, params),
    createBooking: (data) => apiHelper.post(endpoints.bookings, data),
    updateBooking: (id, data) => apiHelper.patch(`${endpoints.bookings}/${id}`, data),
    payBooking: (id, paymentData) => apiHelper.post(`${endpoints.bookings}/${id}/pay`, paymentData),

    createReview: (bookingId, data) => apiHelper.post(`${endpoints.bookings}/${bookingId}/reviews`, data),
    getReviewsByServiceId: (serviceId, params) => apiHelper.get(`/api/services/${serviceId}/reviews`, params),
};

export default customerService;