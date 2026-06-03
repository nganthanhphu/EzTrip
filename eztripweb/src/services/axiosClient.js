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

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);

export default axiosClient;

export const apiHelper = {
    get: (url, params = {}) => axiosClient.get(url, { params }),
    post: (url, data) => axiosClient.post(url, data),
    patch: (url, data) => axiosClient.patch(url, data),
    delete: (url) => axiosClient.delete(url),

    postForm: (url, formData) => axiosClient.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    patchForm: (url, formData) => axiosClient.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
};