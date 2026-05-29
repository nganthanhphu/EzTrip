import Pagination from "react-bootstrap/Pagination";

function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
}) {
    if (!Number.isFinite(totalPages) || totalPages <= 1) {
        return null;
    }

    const safeCurrentPage = Math.min(Math.max(currentPage || 1, 1), totalPages);
    const visibleCount = Math.max(1, Math.min(maxVisiblePages, totalPages));
    const halfWindow = Math.floor(visibleCount / 2);

    let startPage = Math.max(1, safeCurrentPage - halfWindow);
    let endPage = Math.min(totalPages, startPage + visibleCount - 1);

    if (endPage - startPage + 1 < visibleCount) {
        startPage = Math.max(1, endPage - visibleCount + 1);
    }

    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
    );

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages || nextPage === safeCurrentPage) {
            return;
        }

        onPageChange?.(nextPage);

        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <Pagination className="justify-content-center mb-0">
            <Pagination.First onClick={() => goToPage(1)} disabled={safeCurrentPage === 1} />
            <Pagination.Prev
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
            />

            {startPage > 1 && <Pagination.Ellipsis disabled />}

            {pages.map((pageNumber) => (
                <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === safeCurrentPage}
                    onClick={() => goToPage(pageNumber)}
                >
                    {pageNumber}
                </Pagination.Item>
            ))}

            {endPage < totalPages && <Pagination.Ellipsis disabled />}

            <Pagination.Next
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
            />
            <Pagination.Last
                onClick={() => goToPage(totalPages)}
                disabled={safeCurrentPage === totalPages}
            />
        </Pagination>
    );
}

export default PaginationComponent;