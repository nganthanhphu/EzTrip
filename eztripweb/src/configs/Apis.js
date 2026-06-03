export const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

export const endpoints = {
    login: "/api/login",
    register: "/api/users",
    profile: "/api/secure/profile",
    users: "/api/secure/users",
    accommodations: "/api/accommodations",
    secureAccommodations: "/api/secure/accommodations",
    tourisms: "/api/tourisms",
    secureTourisms: "/api/secure/tourisms",
    transportations: "/api/transportations",
    secureTransportations: "/api/secure/transportations",
    bookings: "/api/secure/bookings",
};
