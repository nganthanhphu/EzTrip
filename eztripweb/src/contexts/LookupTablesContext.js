import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLookupTables } from "@services/lookupService";

const DEFAULT_LABELS = {
	genders: {
		MALE: "Nam",
		FEMALE: "Nữ",
		OTHER: "Khác",
	},
	roles: {
		ADMIN: "Quản trị viên",
		CUSTOMER: "Khách hàng",
		PROVIDER: "Nhà cung cấp",
	},
	typeOfProviders: {
		TRAVEL_AGENCY: "Đơn vị du lịch",
		ACCOMMODATION: "Lưu trú",
		TRANSPORTATION: "Vận chuyển",
	},
	typeOfServices: {
		TOURISM: "Tour",
		ACCOMMODATION: "Lưu trú",
		TRANSPORTATION: "Vận chuyển",
	},
	typeOfTransportations: {
		BUS: "Xe khách",
		AIRPLANE: "Máy bay",
		TRAIN: "Tàu hỏa",
		CAR_RENTAL: "Thuê xe",
	},
	bookingStatuses: {
		PENDING: "Đang chờ",
		CONFIRMED: "Đã xác nhận",
		COMPLETED: "Hoàn thành",
		CANCELLED: "Đã hủy",
	},
};

const EMPTY_LOOKUP_TABLES = {
	genders: [],
	roles: [],
	typeOfProviders: [],
	typeOfServices: [],
	typeOfTransportations: [],
	bookingStatuses: [],
};

const LOOKUP_TABLES_QUERY_KEY = ["lookupTables"];

function toOptionList(items, labelMap, valueSelector = (item) => item?.name || "") {
	return (items || []).map((item) => ({
		value: valueSelector(item),
		label: labelMap[item?.name] || item?.name || "",
	}));
}

function buildLookupOptions(rawTables) {
	return {
		genders: toOptionList(rawTables.genders, DEFAULT_LABELS.genders),
		roles: toOptionList(rawTables.roles, DEFAULT_LABELS.roles),
		typeOfProviders: toOptionList(rawTables.typeOfProviders, DEFAULT_LABELS.typeOfProviders),
		typeOfServices: toOptionList(
			rawTables.typeOfServices,
			DEFAULT_LABELS.typeOfServices,
			(item) => item?.id || "",
		),
		typeOfTransportations: toOptionList(
			rawTables.typeOfTransportations,
			DEFAULT_LABELS.typeOfTransportations,
		),
		bookingStatuses: toOptionList(rawTables.bookingStatuses, DEFAULT_LABELS.bookingStatuses),
	};
}

const LookupTablesContext = createContext({
	lookupTables: buildLookupOptions(EMPTY_LOOKUP_TABLES),
	loading: false,
	refreshLookupTables: async () => EMPTY_LOOKUP_TABLES,
});

export function LookupTablesProvider({ children }) {
	const queryClient = useQueryClient();
	const lookupTablesQuery = useQuery({
		queryKey: LOOKUP_TABLES_QUERY_KEY,
		queryFn: fetchLookupTables,
		staleTime: Infinity,
		gcTime: 24 * 60 * 60 * 1000,
	});

	const refreshLookupTables = useCallback(async () => {
		return queryClient.fetchQuery({
			queryKey: LOOKUP_TABLES_QUERY_KEY,
			queryFn: fetchLookupTables,
			staleTime: Infinity,
		});
	}, [queryClient]);

	const value = useMemo(
		() => ({
			lookupTables: buildLookupOptions(lookupTablesQuery.data || EMPTY_LOOKUP_TABLES),
			loading: lookupTablesQuery.isLoading,
			refreshLookupTables,
		}),
		[lookupTablesQuery.data, lookupTablesQuery.isLoading, refreshLookupTables],
	);

	return <LookupTablesContext.Provider value={value}>{children}</LookupTablesContext.Provider>;
}

export function useLookupTables() {
	return useContext(LookupTablesContext);
}