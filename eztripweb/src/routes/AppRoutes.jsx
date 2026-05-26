import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@screens/customer/Home';
import AccommodationList from "@screens/customer/AccommodationList";
import TransportationList from '@screens/customer/TransportationList';
import TourList from '@screens/customer/TourList';
import HistoryBookingList from '@screens/customer/HistoryBookingList';

import Dashboard from '@screens/provider/Dashboard';
import ServiceList from '@screens/provider/ServiceList';

const AppRoutes = () => {
	return (
		<Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accommodation" element={<AccommodationList />} />
            <Route path="/transportation" element={<TransportationList />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/history" element={<HistoryBookingList />} />

            <Route path="provider/dashboard" element={<Dashboard />} />
            <Route path="provider/services" element={<ServiceList />} />

		</Routes>
	);
};

export default AppRoutes;