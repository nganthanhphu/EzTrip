/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import CardHistoryBookingItem from "@components/customer/CardHistoryBookingItem";
import PaginationComponent from "@components/common/PaginationComponent";
import { useLookupTables } from "@contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getBookings } from "@services/customerService";
import usePagedList from "@hooks/usePagedList";

const handleChat = (item) => {
    console.log("Chat for", item);
};

const handlePrimary = (item) => {
    console.log("Primary action for", item);
};

function HistoryBookingList() {
    const [serviceType, setServiceType] = useState("");
    const [status, setStatus] = useState("");
    const [serviceId, setServiceId] = useState("");
    const { lookupTables } = useLookupTables();
    const typeOfServiceOptions = lookupTables.typeOfServices || [];
    const pageSize = 5;
    const { items: bookings, loading, page, totalPages, loadPage } = usePagedList(
        (nextPage) => {
            const params = {
                page: nextPage,
                size: pageSize,
            };

            if (serviceType) {
                params.typeOfService = Number(serviceType);
            }

            if (status) {
                params.status = status;
            }

            if (serviceId) {
                params.serviceId = Number(serviceId);
            }

            return getBookings(params);
        },
        pageSize
    );

    const handleSearch = (event) => {
        event.preventDefault();
        loadPage(1);
    };

    const handlePageChange = (nextPage) => {
        loadPage(nextPage);
    };

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center">
                        <Col md={2}>
                            <Form.Select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                            >
                                <option value="">Loại dịch vụ</option>
                                {typeOfServiceOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Trạng thái</option>
                                {lookupTables.bookingStatuses.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Mã dịch vụ"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                            />
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {bookings.map((item) => (
                            <CardHistoryBookingItem
                                key={item.id} {...item}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </Container>
        </CustomerLayout>
    );
}

export default HistoryBookingList;
