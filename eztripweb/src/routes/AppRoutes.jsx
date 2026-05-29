import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@screens/customer/Home';
import AccommodationList from "@screens/customer/AccommodationList";
import AccommodationDetail from "@screens/customer/AccommodationDetail";
import TransportationList from '@screens/customer/TransportationList';
import TourList from '@screens/customer/TourList';
import TourDetail from '@screens/customer/TourDetail';
import HistoryBookingList from '@screens/customer/HistoryBookingList';

import HomeProvider from '@screens/provider/Home';
import Dashboard from '@screens/provider/Dashboard';
import ServiceList from '@screens/provider/ServiceList';
import BookingList from '@screens/provider/BookingList';
import ChatList from '@screens/provider/ChatList';

import Login from '@screens/auth/Login';
import RegisterCustomer from '@screens/auth/RegisterCustomer';
import RegisterProvider from '@screens/auth/RegisterProvider';
import Logout from '@screens/auth/Logout';
import RoleRoute from '@routes/RoleRoute';

const AppRoutes = () => {
	return (
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterCustomer />} />
            <Route path="/register/provider" element={<RegisterProvider />} />
            <Route path="/provider/register" element={<RegisterProvider />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/provider/logout" element={<Logout />} />

            <Route element={<RoleRoute role="CUSTOMER" />}>
            <Route path="/accommodation" element={<AccommodationList />} />
            <Route
                  path="/accommodation/:id"
                  element={<AccommodationDetail />}
            />
            <Route
                  path="/transportation"
                  element={<TransportationList />}
            />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/history" element={<HistoryBookingList />} />
            </Route>

            <Route element={<RoleRoute role="PROVIDER" />}>
            <Route path="/provider" element={<HomeProvider />} />
            <Route path="/provider/dashboard" element={<Dashboard />} />
            <Route path="/provider/services" element={<ServiceList />} />
            <Route
                  path="/provider/services/:id/BookingList"
                  element={<BookingList />}
            />
            <Route path="/provider/chats" element={<ChatList />} />
            </Route>
      </Routes>
);
};

export default AppRoutes;