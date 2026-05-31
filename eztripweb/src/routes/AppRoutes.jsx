import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Home from '@screens/common/Home';
import AccommodationList from "@screens/common/AccommodationList";
import AccommodationDetail from "@screens/common/AccommodationDetail";
import TransportationList from '@screens/common/TransportationList';
import TourList from '@screens/common/TourList';
import TourDetail from '@screens/common/TourDetail';
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

function RootRedirect() {
      const { currentUser, loading } = useAuth();

      if (loading) return null;

      const currentRole = currentUser?.role;

      if (currentRole === 3) {
            return <Navigate to="/provider" replace />;
      }

      return <Home />;
}

const AppRoutes = () => {
      return (
      <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterCustomer />} />
            <Route path="/register/provider" element={<RegisterProvider />} />
            <Route path="/provider/register" element={<RegisterProvider />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/provider/logout" element={<Logout />} />

            <Route path="/accommodation" element={<AccommodationList />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/transportation" element={<TransportationList />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetail />} />

            <Route element={<RoleRoute role="CUSTOMER" />}>
                  <Route path="/history" element={<HistoryBookingList />} />
            </Route>

            <Route element={<RoleRoute role="PROVIDER" />}>
                  <Route path="/provider" element={<HomeProvider />} />
                  <Route path="/provider/dashboard" element={<Dashboard />} />
                  <Route path="/provider/services" element={<ServiceList />} />
                  <Route path="/provider/services/:id/bookings" element={<BookingList />} />
                  <Route path="/provider/chats" element={<ChatList />} />
            </Route>
      </Routes>
);
};

export default AppRoutes;