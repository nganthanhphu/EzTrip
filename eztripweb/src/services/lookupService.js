import axiosClient from "@services/axiosClient";

const lookupEndpoints = {
    genders: "/api/genders",
    roles: "/api/roles",
	typeOfProviders: "/api/type-of-providers",
	typeOfServices: "/api/type-of-services",
    typeOfTransportations: "/api/type-of-transportations",
    bookingStatuses: "/api/booking-statuses",
};

async function requestLookup(endpoint) {
	const response = await axiosClient.get(endpoint);
	return response.data;
}

export async function fetchLookupTables() {
	const entries = Object.entries(lookupEndpoints);
	const settledResults = await Promise.allSettled(
		entries.map(([, endpoint]) => requestLookup(endpoint)),
	);

	return settledResults.reduce((tables, result, index) => {
		if (result.status === "fulfilled") {
			const [key] = entries[index];
			tables[key] = Array.isArray(result.value) ? result.value : [];
		}

		return tables;
	}, {});
}