import axios from "axios";
import { SERVER_URL } from "@configs/Apis";
import { getStoredToken } from "@utils/authCookieHelper";

const axiosClient = axios.create({
	baseURL: SERVER_URL,
});

axiosClient.interceptors.request.use((config) => {
	const token = getStoredToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

export default axiosClient;
