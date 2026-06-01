/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import CardHistoryBookingItem from "@components/customer/CardHistoryBookingItem";
import { useLookupTables } from "@contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getBookings } from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";

function HistoryBookingList() {
    const [serviceType, setServiceType] = useState("");
    const [status, setStatus] = useState("");
    const [serviceId, setServiceId] = useState("");
    const { lookupTables } = useLookupTables();
    const typeOfServiceOptions = lookupTables.typeOfServices || [];
    const pageSize = 5;

    const fetchBookings = React.useCallback(
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

            return getBookings(params).then((response) => {
                if (Array.isArray(response)) return response;
                return response?.content || response?.items || response?.results || [];
            });
        },
        [serviceType, status, serviceId, pageSize]
    );

    const {
        items: bookings,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        refetch,
    } = useInfiniteScrollList({
        queryKey: ["bookings", serviceType, status, serviceId, pageSize],
        fetchPage: fetchBookings,
        pageSize,
    });
    const nav = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const t = searchParams.get("type") || "";
        const s = searchParams.get("status") || "";
        const sid = searchParams.get("serviceId") || "";

        if (t !== serviceType) setServiceType(t);
        if (s !== status) setStatus(s);
        if (sid !== serviceId) setServiceId(sid);
    }, [searchParams.toString()]);

    const handleSearch = (event) => {
        event.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (serviceType) params.set("type", serviceType); else params.delete("type");
        if (status) params.set("status", status); else params.delete("status");
        if (serviceId) params.set("serviceId", serviceId); else params.delete("serviceId");
        params.delete("page");
        nav(`?${params.toString()}`);
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
                                {(lookupTables.bookingStatuses || []).map((option) => (
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
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        initialLoad={false}
                        threshold={250}
                    >
                        <div className="d-flex flex-column gap-3">
                            {bookings.map((item) => (
                                <CardHistoryBookingItem
                                    key={item.id}
                                    {...item}
                                    onUpdated={() => refetch()}
                                />
                            ))}
                        </div>
                        {loadingMore ? (
                            <div className="py-4 d-flex justify-content-center">
                                <MySpinner />
                            </div>
                        ) : null}
                    </InfiniteScroll>
                )}
            </Container>
        </CustomerLayout>
    );
}

export default HistoryBookingList;
