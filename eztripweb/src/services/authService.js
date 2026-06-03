import { apiHelper } from "@services/axiosClient";
import { endpoints } from "@configs/Apis";

export const loginWithPassword = (phoneNumber, password) =>
    apiHelper.post(endpoints.login, { phoneNumber, password });

export const fetchCurrentUser = () => apiHelper.get(endpoints.profile);

export const updateCurrentUserProfile = (formData) =>
    apiHelper.patchForm(endpoints.users, formData);

export const registerUser = (formData) =>
    apiHelper.postForm(endpoints.register, formData);
