import axiosClient from "@services/axiosClient";

// Hàm hỗ trợ gửi yêu cầu với chuỗi query string
const requestList = async (endpoint, queryString = "") => {
    // Xử lý chuỗi query: loại bỏ dấu '?' ở đầu nếu có để tránh lỗi '??' khi ghép chuỗi
    const cleanQuery = queryString.replace(/^\?/, "");
    const url = cleanQuery ? `${endpoint}?${cleanQuery}` : endpoint;
    
    const response = await axiosClient.get(url);
    return response.data;
};

const requestById = async (endpoint, id) => {
    const response = await axiosClient.get(`${endpoint}/${id}`);
    return response.data;
};

const requestJsonCreate = async (endpoint, data) => {
    const response = await axiosClient.post(endpoint, data);
    return response.data;
};

// ==========================================
// CÁC HÀM API CỤ THỂ
// ==========================================

// 1. Nghiệp vụ lưu trú
export async function getAccommodations(queryString = "") {
    return requestList("/api/accommodations", queryString);
}

export async function getAccommodationById(id) {
    return requestById("/api/accommodations", id);
}

export async function compareAccommodations(queryString = "") {
    return requestList("/api/accommodations/compare", queryString);
}

// 2. Nghiệp vụ tour du lịch
export async function getTourisms(queryString = "") {
    return requestList("/api/tourisms", queryString);
}

export async function getTourismById(id) {
    return requestById("/api/tourisms", id);
}

export async function compareTourisms(queryString = "") {
    return requestList("/api/tourisms/compare", queryString);
}

// 3. Nghiệp vụ phương tiện vận chuyển
export async function getTransportations(queryString = "") {
    return requestList("/api/transportations", queryString);
}

// 4. Nghiệp vụ đặt chỗ
export async function getBookings(queryString = "") {
    return requestList("/api/secure/bookings", queryString);
}

export async function createBooking(booking) {
    return requestJsonCreate("/api/secure/bookings", booking);
}

export async function updateBooking(bookingId, booking) {
    return axiosClient.patch(`/api/secure/bookings/${bookingId}`, booking);
}

// 5. Nghiệp vụ đánh giá
export async function createReview(bookingId, review) {
    return requestJsonCreate(`/api/secure/bookings/${bookingId}/reviews`, review);
}

export async function getReviewsByServiceId(serviceId, queryString = "") {
    return requestList(`/api/services/${serviceId}/reviews`, queryString);
}

export async function payBooking(bookingId, paymentData) {
    const response = await axiosClient.post(`/api/secure/bookings/${bookingId}/pay`, paymentData);
    return response.data;
}

const customerService = {
    getAccommodations,
    getAccommodationById,
    compareAccommodations,
    getTourisms,
    getTourismById,
    compareTourisms,
    getTransportations,
    getBookings,
    createBooking,
    updateBooking,
    createReview,
    getReviewsByServiceId,
    payBooking,
};

export default customerService;