
function PaginationComponent({ page, isActive, onClick }) {
    return (
        <li className={`page-item ${isActive ? "active" : ""}`}>
            <button className="page-link" onClick={onClick}>
                {page}
            </button>
        </li>
    );
}