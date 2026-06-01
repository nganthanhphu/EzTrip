import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CardServiceItem from "@components/provider/CardServiceItem";
import ModalCreateEditService from "@components/provider/ModalCreateEditService";
import MySpinner from "@components/common/MySpinner";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";

import ProviderLayout from "@layouts/ProviderLayout";
import { getProviderServices } from "@services/providerService";

function ServiceList() {
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showCreateEditModal, setShowCreateEditModal] = useState(false);
    const [selectedEditServiceId, setSelectedEditServiceId] = useState("");
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const pageSize = 5;
    const [sortBy, order] = sortOption ? sortOption.split("|") : [];
    const searchParamsString = searchParams.toString();
    const serviceCacheRef = useRef([]);
    const serviceCacheKeyRef = useRef("");

    const fetchServices = async (pageNumber = 1) => {
        const cacheKey = [appliedSearchText, sortBy, order].join("|");
        if (serviceCacheKeyRef.current !== cacheKey) {
            serviceCacheKeyRef.current = cacheKey;
            serviceCacheRef.current = [];
        }

        if (serviceCacheRef.current.length === 0) {
            const response = await getProviderServices({
                name: appliedSearchText,
                sortBy,
                order,
            });

            serviceCacheRef.current = Array.isArray(response)
                ? response
                : response?.content || response?.items || response?.results || [];
        }

        const startIndex = (pageNumber - 1) * pageSize;
        return serviceCacheRef.current.slice(startIndex, startIndex + pageSize);
    };

    const {
        items: services,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        error,
    } = useInfiniteScrollList({
        queryKey: ["provider-services", appliedSearchText, sortBy, order, pageSize],
        fetchPage: fetchServices,
        pageSize,
    });

    // keep state in sync when URL changes (back/forward)
    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const q = params.get("q") || "";
        const sort = params.get("sort") || "";

        setAppliedSearchText(q);
        setSearchText(q);
        setSortOption(sort);
    }, [searchParamsString]);

    function handleSearch(event) {
        event.preventDefault();
        const q = searchText.trim();
        setAppliedSearchText(q);
        const params = new URLSearchParams(searchParams);
        if (q) params.set("q", q); else params.delete("q");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");
        nav(`?${params.toString()}`);
    }

    function handleSortChange(event) {
        const value = event.target.value;
        setSortOption(value);
        const params = new URLSearchParams(searchParams);
        if (searchText) params.set("q", searchText.trim()); else params.delete("q");
        if (value) params.set("sort", value); else params.delete("sort");
        params.delete("page");
        nav(`?${params.toString()}`);
    }

    // Detail modal is not used currently; remove unused handler to satisfy linter

    function handleOpenCreate() {
        setSelectedEditServiceId("");
        setShowCreateEditModal(true);
    }

    function handleOpenEdit(serviceId) {
        setSelectedEditServiceId(serviceId);
        setShowCreateEditModal(true);
    }

    return (
        <ProviderLayout>
            <Container className="py-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên dịch vụ"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Select value={sortOption} onChange={handleSortChange}>
                                <option value="">Sắp xếp</option>
                                <option value="price|asc">Giá thấp đến cao</option>
                                <option value="price|desc">Giá cao đến thấp</option>
                                <option value="hot|desc">Hot nhất đến thấp</option>
                                <option value="hot|asc">Hot thấp đến cao</option>
                            </Form.Select>
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                Tìm kiếm
                            </Button>
                        </Col>

                        <Col md={3} className="d-grid">
                            <Button variant="primary" onClick={handleOpenCreate}>
                            Tạo dịch vụ
                            </Button>
                        </Col>
                        
                    </Row>
                </Form>

                {error ? <Alert variant="danger">{error}</Alert> : null}

                {loading ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        initialLoad={false}
                        threshold={250}
                    >
                        <div className="d-flex flex-column gap-3">
                            {services.map((service) => (
                                <CardServiceItem
                                    key={service.id} {...service}
                                    onEdit={() => handleOpenEdit(service.baseInfo?.id ?? service.id)}
                                />
                            ))}

                            {services.length === 0 ? (
                                <div className="text-center text-secondary py-5 border border-dashed border-dark-subtle">
                                    Không tìm thấy dịch vụ phù hợp.
                                </div>
                            ) : null}

                        </div>
                        {loadingMore ? (
                            <div className="py-4 d-flex justify-content-center">
                                <MySpinner />
                            </div>
                        ) : null}
                    </InfiniteScroll>
                )}

                <ModalCreateEditService
                    show={showCreateEditModal}
                    onHide={() => setShowCreateEditModal(false)}
                    serviceId={selectedEditServiceId}
                />
            </Container>
        </ProviderLayout>
    );
}

export default ServiceList;
