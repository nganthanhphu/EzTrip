import axiosClient from "@services/axiosClient";
import { endpoints } from "@configs/Apis";

export async function loginWithPassword(phoneNumber, password) {
	const response = await axiosClient.post(endpoints.login, {
		phoneNumber,
		password,
	});

	return response.data;
}

export async function fetchCurrentUser() {
	const response = await axiosClient.get(endpoints.profile);

	return response.data;
}
