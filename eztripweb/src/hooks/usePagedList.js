import { useCallback, useEffect, useRef, useState } from "react";

function usePagedList(fetchPage, pageSize = 5) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    
    const fetchPageRef = useRef(fetchPage);
    useEffect(() => {
        fetchPageRef.current = fetchPage;
    }, [fetchPage]);

    const loadPage = useCallback(async (nextPage = 1, params = {}) => {
        try {
            setLoading(true);
            const response = await fetchPageRef.current(nextPage, params);
            const nextItems = response || [];

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
    }, [pageSize]);

    useEffect(() => {
        const loadInitialPage = async () => {
            try {
                await loadPage(1);
            } catch (error) {
                console.error("Error loading paged list:", error);
            }
        };

        loadInitialPage();
    }, [loadPage]);

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
