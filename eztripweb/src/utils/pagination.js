export function normalizePagedResponse(response) {
    if (Array.isArray(response)) {
        return {
            items: response,
            totalPages: 1,
        };
    }

    const items =
        response?.content ||
        response?.data ||
        response?.items ||
        response?.results ||
        [];

    const totalElements = Number(
        response?.totalElements ?? response?.totalCount ?? response?.count
    );
    const pageSize = Number(response?.size ?? response?.pageSize ?? items.length);
    const pageCount = Number(
        response?.totalPages ?? response?.totalPage ?? response?.pages
    );

    let totalPages = Number.isFinite(pageCount) && pageCount > 0 ? pageCount : 0;

    if (!totalPages && Number.isFinite(totalElements) && pageSize > 0) {
        totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    }

    if (!totalPages && items.length) {
        totalPages = 1;
    }

    return {
        items,
        totalPages,
    };
}