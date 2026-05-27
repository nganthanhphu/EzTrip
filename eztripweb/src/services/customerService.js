import axiosClient from "@services/axiosClient";
// Hàm hỗ trợ gửi yêu cầu 
const requestList = async (endpoint, params = {}) => {
	const response = await axiosClient.get(endpoint, { params });
	return response.data;
};

const requestById = async (endpoint, id) => {
	const response = await axiosClient.get(`${endpoint}/${id}`);
	return response.data;
};

const requestMultipartCreate = async (endpoint, data) => {
	const response = await axiosClient.post(endpoint, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

const requestJsonCreate = async (endpoint, data) => {
	const response = await axiosClient.post(endpoint, data);
	return response.data;
};

// Các hàm API cụ thể
//1. Nghiệp vụ lưu trú
export async function getAccommodations(params = {}) {
	return requestList("/api/accommodations", params);
}

export async function getAccommodationById(id) {
	return requestById("/api/accommodations", id);
}

export async function createAccommodation(accommodationFormData) {
	return requestMultipartCreate("/api/secure/accommodations", accommodationFormData);
}

//2. Nghiệp vụ tour du lịch
export async function getTourisms(params = {}) {
	return requestList("/api/tourisms", params);
}

export async function getTourismById(id) {
	return requestById("/api/tourisms", id);
}

export async function createTourism(tourismFormData) {
	return requestMultipartCreate("/api/secure/tourisms", tourismFormData);
}

//3. Nghiệp vụ phương tiện vận chuyển
export async function getTransportations(params = {}) {
	return requestList("/api/transportations", params);
}

export async function getTransportationById(id) {
	return requestById("/api/transportations", id);
}

export async function createTransportation(transportationFormData) {
	return requestMultipartCreate("/api/secure/transportations", transportationFormData);
}

//4. Nghiệp vụ đặt chỗ
export async function getBookings(params = {}) {
	return requestList("/api/secure/bookings", params);
}

export async function getBookingById(id) {
	return requestById("/api/secure/bookings", id);
}

export async function createBooking(booking) {
	return requestJsonCreate("/api/secure/bookings", booking);
}
