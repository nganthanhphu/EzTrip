import { useEffect, useState } from "react";

function normalizeListResponse(response) {
    if (Array.isArray(response)) {
        return response;
    }

    return response?.content || response?.items || response?.results || [];
}

function usePagedList(fetchPage, pageSize = 5) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const loadPage = async (nextPage = page, params = {}) => {
        try {
            setLoading(true);
            const response = await fetchPage(nextPage, params);
            const nextItems = normalizeListResponse(response);

            setItems(nextItems);
            setPage(nextPage);
            setTotalPages(nextItems.length === pageSize ? nextPage + 1 : nextPage);
        } catch (error) {
            setItems([]);
            setTotalPages(0);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialPage = async () => {
            try {
                await loadPage(1);
            } catch (error) {
                console.error("Error loading paged list:", error);
            }
        };

        loadInitialPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        items,
        loading,
        page,
        totalPages,
        setPage,
        loadPage,
        setItems,
    };
}

export default usePagedList;
