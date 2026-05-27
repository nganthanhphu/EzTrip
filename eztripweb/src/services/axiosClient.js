import axios from "axios";
import { SERVER_URL } from "@configs/Apis";
import { getStoredToken } from "@utils/localStorageHelper";

const axiosClient = axios.create({
	baseURL: SERVER_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosClient.interceptors.request.use((config) => {
	const token = getStoredToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default axiosClient;
