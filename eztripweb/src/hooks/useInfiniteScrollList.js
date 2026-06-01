import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function useInfiniteScrollList({ queryKey, fetchPage, pageSize = 5 }) {
    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = 1 }) => fetchPage(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const lastPageItems = lastPage;
            if (lastPageItems.length < pageSize) {
                return undefined;
            }

            return allPages.length + 1;
        },
    });

    const items = useMemo(
        () => query.data?.pages.flatMap((page) => page) || [],
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
        hasMore: Boolean(query.hasNextPage),
        loadMore,
        refetch: query.refetch,
        error: query.error,
    };
}

export default useInfiniteScrollList;