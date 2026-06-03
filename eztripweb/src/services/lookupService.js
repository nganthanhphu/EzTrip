import { apiHelper } from "@services/axiosClient";

const lookupEndpoints = {
    genders: "/api/genders",
    roles: "/api/roles",
    typeOfProviders: "/api/type-of-providers",
    typeOfServices: "/api/type-of-services",
    typeOfTransportations: "/api/type-of-transportations",
    bookingStatuses: "/api/booking-statuses",
};

export async function fetchLookupTables() {
    const entries = Object.entries(lookupEndpoints);

    const settledResults = await Promise.allSettled(
        entries.map(([, endpoint]) => apiHelper.get(endpoint))
    );

    return settledResults.reduce((tables, result, index) => {
        const [key] = entries[index];
        
        if (result.status === "fulfilled") {
            tables[key] = Array.isArray(result.value) ? result.value : [];
        } else {
            console.warn(`[LookupService] Lỗi khi tải bảng tra cứu '${key}':`, result.reason);
            tables[key] = []; 
        }

        return tables;
    }, {});
}