import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function useInfiniteScrollList({ queryKey, fetchPage }) {
    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 1 }) => fetchPage(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage || lastPage.length === 0) {
                return undefined; 
            }
            return allPages.length + 1;
        },
    });

    const items = useMemo(
        () => query.data?.pages.flat() || [],
        [query.data]
    );

    const loadMore = () => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    };

    return {
        items,
        loading: query.isLoading,
        loadingMore: query.isFetchingNextPage,
        hasMore: query.hasNextPage,
        loadMore,
        refetch: query.refetch,
        error: query.error,
    };
}

export default useInfiniteScrollList;