import axios from "axios";
import cookies from "react-cookies";

export const SERVER_URL = "http://localhost:8080/EzTripApp";

export const endpoints = {
    login: "/api/login",
    register: "/api/users",
    profile: "/api/secure/profile",
    users: "/api/secure/users",
};

export const authApis = () => {
    return axios.create({
        baseURL: SERVER_URL,
        headers: {
            Authorization: `Bearer ${cookies.load("token")}`,
        },
    });
};

export default axios.create({
    baseURL: SERVER_URL,
});