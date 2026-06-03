import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import CardServiceItem from "@components/provider/CardServiceItem";
import ModalCreateEditService from "@components/provider/ModalCreateEditService";
import MySpinner from "@components/common/MySpinner";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";
import { useAuth } from "@hooks/useAuth";

import ProviderLayout from "@layouts/ProviderLayout";
import providerService from "@services/providerService";

import { useQueryClient } from "@tanstack/react-query"; 

function ServiceList() {
    const { currentUser } = useAuth();

    const [searchText, setSearchText] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [showCreateEditModal, setShowCreateEditModal] = useState(false);
    const [selectedEditServiceId, setSelectedEditServiceId] = useState("");

    const queryClient = useQueryClient(); 
    const debouncedSearchText = useDebounce(searchText);

    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const fetchServices = async (pageNumber = 1) => {
        const response = await providerService.getProviderServices({
            name: debouncedSearchText,
            sortBy,
            order,
            page: pageNumber,
        });

        return response || [];
    };

    const {
        items: services,
        loading,
        hasMore,
        loadMore,
        error,
    } = useInfiniteScrollList({
        queryKey: [
            "provider-services",
            currentUser?.id,
            debouncedSearchText,
            sortBy,
            order
        ],
        fetchPage: fetchServices
    });

    function handleSortChange(event) {
        setSortOption(event.target.value);
    }

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
                                <option value="price|asc">Giá thấp đến cao</option>
                                <option value="price|desc">Giá cao đến thấp</option>
                                <option value="hot|desc">Hot nhất đến thấp</option>
                                <option value="hot|asc">Hot thấp đến cao</option>
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
                        dataLength={services.length}
                        next={loadMore}
                        hasMore={hasMore || false}
                        loader={<div className="py-4 d-flex justify-content-center"><MySpinner /></div>}
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