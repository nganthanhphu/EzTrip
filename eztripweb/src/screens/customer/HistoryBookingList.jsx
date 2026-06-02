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
import { useAuth } from "@hooks/useAuth";

function HistoryBookingList() {
    const { currentUser } = useAuth();

    const nav = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [serviceType, setServiceType] = useState(() => searchParams.get("serviceType") || "");
    const [status, setStatus] = useState(() => searchParams.get("status") || "");
    const [serviceName, setServiceName] = useState(() => searchParams.get("serviceName") || "");
    const debouncedServiceType = useDebounce(serviceType);
    const debouncedStatus = useDebounce(status);
    const debouncedServiceName = useDebounce(serviceName);
    const { lookupTables } = useLookupTables();
    const typeOfServiceOptions = lookupTables.typeOfServices || [];
    const pageSize = 5;

    const fetchBookings = React.useCallback(
        (nextPage) => {
            const params = new URLSearchParams();
            params.append("page", nextPage);
            params.append("size", pageSize);

            if (debouncedServiceType)
                params.append("serviceType", debouncedServiceType);
            if (debouncedStatus) params.append("status", debouncedStatus);
            if (debouncedServiceName)
                params.append("serviceName", debouncedServiceName);

            return getBookings(params.toString());
        },
        [currentUser?.id, debouncedServiceType, debouncedStatus, debouncedServiceName, pageSize],
    );

    const {
        items: bookings,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        refetch,
    } = useInfiniteScrollList({
        queryKey: ["bookings", currentUser?.id, debouncedServiceType, debouncedStatus, debouncedServiceName, pageSize],
        fetchPage: fetchBookings,
        pageSize,
    });

    useEffect(() => {
        const t = searchParams.get("serviceType") || "";
        const s = searchParams.get("status") || "";
        const n = searchParams.get("serviceName") || "";

        if (t !== serviceType) setServiceType(t);
        if (s !== status) setStatus(s);
        if (n !== serviceName) setServiceName(n);
    }, [searchParams.toString()]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextServiceType = debouncedServiceType.trim();
        const nextStatus = debouncedStatus.trim();
        const nextServiceName = debouncedServiceName.trim();

        if (nextServiceType) params.set("serviceType", nextServiceType); else params.delete("serviceType");
        if (nextStatus) params.set("status", nextStatus); else params.delete("status");
        if (nextServiceName) params.set("serviceName", nextServiceName); else params.delete("serviceName");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            nav({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedServiceType, debouncedStatus, debouncedServiceName, searchParamsString, nav]);

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Tên dịch vụ"
                                value={serviceName}
                                onChange={(e) => setServiceName(e.target.value)}
                            />
                        </Col>
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
                                {(lookupTables.bookingStatuses || []).map(
                                    (option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </Form.Select>
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
