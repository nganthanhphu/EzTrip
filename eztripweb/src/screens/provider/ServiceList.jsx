import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CardServiceItem from "@components/provider/CardServiceItem";
import ModalCreateEditService from "@components/provider/ModalCreateEditService";
import MySpinner from "@components/common/MySpinner";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";
import { useAuth } from "@hooks/useAuth";

import ProviderLayout from "@layouts/ProviderLayout";
import { getProviderServices } from "@services/providerService";

import { useQueryClient } from "@tanstack/react-query"; 

function ServiceList() {
    const { currentUser } = useAuth();

    const [searchText, setSearchText] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showCreateEditModal, setShowCreateEditModal] = useState(false);
    const [selectedEditServiceId, setSelectedEditServiceId] = useState("");

    const queryClient = useQueryClient(); 

    const debouncedSearchText = useDebounce(searchText);
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const pageSize = 5;
    const [sortBy, order] = sortOption ? sortOption.split("|") : [];
    const searchParamsString = searchParams.toString();
    const serviceCacheRef = useRef([]);
    const serviceCacheKeyRef = useRef("");

    useEffect(() => {
        serviceCacheRef.current = [];
        serviceCacheKeyRef.current = "";
    }, [currentUser?.id]);

    const fetchServices = async (pageNumber = 1) => {
        const cacheKey = [debouncedSearchText, sortBy, order].join("|");

        if (serviceCacheKeyRef.current !== cacheKey) {
            serviceCacheKeyRef.current = cacheKey;
            serviceCacheRef.current = [];
        }

        if (serviceCacheRef.current.length === 0) {
            const response = await getProviderServices({
                name: debouncedSearchText,
                sortBy,
                order,
            });

            serviceCacheRef.current = Array.isArray(response)
                ? response
                : response?.content ||
                response?.items ||
                response?.results ||
                [];
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
        queryKey: [
            "provider-services",
            currentUser?.id,
            debouncedSearchText,
            sortBy,
            order,
            pageSize,
        ],
        fetchPage: fetchServices,
        pageSize,
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const q = params.get("q") || "";
        const sort = params.get("sort") || "";

        setSearchText(q);
        setSortOption(sort);
    }, [searchParamsString]);

    function handleSortChange(event) {
        setSortOption(event.target.value);
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const q = debouncedSearchText;

        if (q) params.set("q", q);
        else params.delete("q");
        if (sortOption) params.set("sort", sortOption);
        else params.delete("sort");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            nav(
                {
                    pathname: window.location.pathname,
                    search: nextSearch ? `?${nextSearch}` : "",
                },
                { replace: true },
            );
        }
    }, [debouncedSearchText, sortOption, searchParamsString, nav]);

    function handleOpenCreate() {
        setSelectedEditServiceId("");
        setShowCreateEditModal(true);
    }

    function handleOpenEdit(serviceId) {
        setSelectedEditServiceId(serviceId);
        setShowCreateEditModal(true);
    }

    function handleSuccess() {
        setShowCreateEditModal(false);
        
        serviceCacheRef.current = [];
        serviceCacheKeyRef.current = "";

        queryClient.invalidateQueries({ queryKey: ["provider-services"] });
    }

    return (
        <ProviderLayout>
            <Container className="py-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên dịch vụ"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Select
                                value={sortOption}
                                onChange={handleSortChange}
                            >
                                <option value="">Sắp xếp</option>
                                <option value="price|asc">
                                    Giá thấp đến cao
                                </option>
                                <option value="price|desc">
                                    Giá cao đến thấp
                                </option>
                                <option value="hot|desc">
                                    Hot nhất đến thấp
                                </option>
                                <option value="hot|asc">
                                    Hot thấp đến cao
                                </option>
                            </Form.Select>
                        </Col>

                        <Col md={4} className="d-grid">
                            <Button
                                variant="primary"
                                onClick={handleOpenCreate}
                            >
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
                                    key={service.id}
                                    {...service}
                                    onEdit={() =>
                                        handleOpenEdit(
                                            service.baseInfo?.id ?? service.id,
                                        )
                                    }
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
                    onSuccess={handleSuccess}
                    serviceId={selectedEditServiceId}
                />
            </Container>
        </ProviderLayout>
    );
}

export default ServiceList;