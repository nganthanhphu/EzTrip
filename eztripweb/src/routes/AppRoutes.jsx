import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@screens/customer/Home';
import AccommodationList from "@screens/customer/AccommodationList";
import AccommodationDetail from "@screens/customer/AccommodationDetail";
import TransportationList from '@screens/customer/TransportationList';
import TourList from '@screens/customer/TourList';
import TourDetail from '@screens/customer/TourDetail';
import HistoryBookingList from '@screens/customer/HistoryBookingList';

import Dashboard from '@screens/provider/Dashboard';
import ServiceList from '@screens/provider/ServiceList';
import BookingList from '@screens/provider/BookingList';
import Chat from '@screens/common/Chat';

const AppRoutes = () => {
	return (
		<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accommodation" element={<AccommodationList />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/transportation" element={<TransportationList />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/tours/:id" element={<TourDetail />} />
            <Route path="/history" element={<HistoryBookingList />} />

            <Route path="/provider/dashboard" element={<Dashboard />} />
            <Route path="/provider/services" element={<ServiceList />} />
            <Route path="/provider/services/:id/BookingList" element={<BookingList />} />
            <Route path="/chat/:fromId/:toId" element={<Chat />} />

		</Routes>
	);
};

export default AppRoutes;