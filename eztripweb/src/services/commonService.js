import axiosClient from "@services/axiosClient";

const requestList = async (endpoint, params = {}) => {
	const response = await axiosClient.get(endpoint, { params });
	return response.data;
};

const requestById = async (endpoint, id) => {
	const response = await axiosClient.get(`${endpoint}/${id}`);
	return response.data;
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

const commonService = {
	getAccommodations,
	getAccommodationById,
	getTransportations,
	getTransportationById,
	getTourisms,
	getTourismById,
	getReviewsByServiceId,
};

export default commonService;
