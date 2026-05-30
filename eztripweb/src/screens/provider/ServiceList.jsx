import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import CardServiceItem from "@components/provider/CardServiceItem";
import ModalServiceDetail from "@components/provider/ModalServiceDetail";
import ModalCreateEditService from "@components/provider/ModalCreateEditService";
import PaginationComponent from "@components/common/PaginationComponent";
import { useAuth } from "@hooks/useAuth";
import { useLookupTables } from "@contexts/LookupTablesContext";

import ProviderLayout from "@layouts/ProviderLayout";
import { getProviderServices } from "@services/providerService";

function ServiceList() {
    const [searchText, setSearchText] = useState("");
    const [appliedSearchText, setAppliedSearchText] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showCreateEditModal, setShowCreateEditModal] = useState(false);
    const [selectedEditServiceId, setSelectedEditServiceId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const nav = useNavigate();
    const { currentUser } = useAuth();
    const { lookupTables } = useLookupTables();
    const pageSize = 5;
    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const providerTypeId =
        currentUser?.providerProfile?.typeOfProvider ??
        currentUser?.typeOfProvider ??
        currentUser?.providerTypeId ??
        "";
    const providerTypeLabel = lookupTables.typeOfProviders.find(
        (option) => String(option.value) === String(providerTypeId),
    )?.label;

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProviderServices({
                    name: appliedSearchText,
                    sortBy,
                    order,
                });
                const items = Array.isArray(response)
                    ? response
                    : response?.content || response?.items || response?.results || [];

                setServices(items);
            } catch (fetchError) {
                console.error("Error fetching provider services:", fetchError);
                setServices([]);
                setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [appliedSearchText, sortBy, order]);

    const totalPages = Math.ceil(services.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const pagedServices = services.slice(startIndex, startIndex + pageSize);

    function handleSearch(event) {
        event.preventDefault();
        setAppliedSearchText(searchText.trim());
        setCurrentPage(1);
    }

    function handleSortChange(event) {
        setSortOption(event.target.value);
        setCurrentPage(1);
    }

    function handlePageChange(nextPage) {
        setCurrentPage(nextPage);
    }

    function handleOpenDetail(service) {
        setSelectedService(service);
        setShowDetailModal(true);
    }

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

                <div className="d-flex flex-column gap-3">
                    {pagedServices.map((service) => (
                        <CardServiceItem
                            key={service.id} {...service}
                            onEdit={() => handleOpenEdit(service.baseInfo?.id ?? service.id)}
                        />
                    ))}

                    {!loading && services.length === 0 ? (
                        <div className="text-center text-secondary py-5 border border-dashed border-dark-subtle">
                            Không tìm thấy dịch vụ phù hợp.
                        </div>
                    ) : null}

                </div>

                {totalPages > 1 ? (
                    <div className="d-flex justify-content-center mt-4">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                ) : null}

                <ModalServiceDetail
                    show={showDetailModal}
                    onHide={() => setShowDetailModal(false)}
                    service={selectedService}
                />

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
