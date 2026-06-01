import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import CardHistoryBookingItem from "@components/customer/CardHistoryBookingItem";
import { useLookupTables } from "@contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getBookings } from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";

function HistoryBookingList() {
    const [serviceType, setServiceType] = useState("");
    const [status, setStatus] = useState("");
    const [serviceId, setServiceId] = useState("");
    const debouncedServiceType = useDebounce(serviceType);
    const debouncedStatus = useDebounce(status);
    const debouncedServiceId = useDebounce(serviceId);
    const { lookupTables } = useLookupTables();
    const typeOfServiceOptions = lookupTables.typeOfServices || [];
    const pageSize = 5;

    const fetchBookings = React.useCallback(
        (nextPage) => {
            const params = {
                page: nextPage,
                size: pageSize,
            };

            if (debouncedServiceType) {
                params.typeOfService = Number(debouncedServiceType);
            }

            if (debouncedStatus) {
                params.status = debouncedStatus;
            }

            if (debouncedServiceId) {
                params.serviceId = Number(debouncedServiceId);
            }

            return getBookings(params).then((response) => {
                if (Array.isArray(response)) return response;
                return response?.content || response?.items || response?.results || [];
            });
        },
        [debouncedServiceType, debouncedStatus, debouncedServiceId, pageSize]
    );

    const {
        items: bookings,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        refetch,
    } = useInfiniteScrollList({
        queryKey: ["bookings", debouncedServiceType, debouncedStatus, debouncedServiceId, pageSize],
        fetchPage: fetchBookings,
        pageSize,
    });
    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    useEffect(() => {
        const t = searchParams.get("type") || "";
        const s = searchParams.get("status") || "";
        const sid = searchParams.get("serviceId") || "";

        if (t !== serviceType) setServiceType(t);
        if (s !== status) setStatus(s);
        if (sid !== serviceId) setServiceId(sid);
    }, [searchParams.toString()]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextServiceType = debouncedServiceType.trim();
        const nextStatus = debouncedStatus.trim();
        const nextServiceId = debouncedServiceId.trim();

        if (nextServiceType) params.set("type", nextServiceType); else params.delete("type");
        if (nextStatus) params.set("status", nextStatus); else params.delete("status");
        if (nextServiceId) params.set("serviceId", nextServiceId); else params.delete("serviceId");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            nav({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedServiceType, debouncedStatus, debouncedServiceId, searchParamsString, nav]);

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={4}>
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

                        <Col md={4}>
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

                        <Col md={4}>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Mã dịch vụ"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                            />
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
