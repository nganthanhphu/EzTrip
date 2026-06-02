/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react"; // Đã thêm useCallback
import { Container, Row, Col, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import TransportationItem from "@components/customer/CardTransportationItem";
import ModalConfirmTransportationBooking from "@components/customer/ModalConfirmTransportationBooking";
import { useLookupTables } from "@contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getTransportations } from "@services/customerService";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";

function TransportationList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [departureLocation, setDepartureLocation] = useState(() => searchParams.get("departureLocation") || "");
    const [arrivalLocation, setArrivalLocation] = useState(() => searchParams.get("arrivalLocation") || "");
    const [typeOfTransportation, setTypeOfTransportation] = useState(() => searchParams.get("type") || "");
    const [departureTime, setDepartureTime] = useState(() => searchParams.get("departureTime") || "");
    const [fromPrice, setFromPrice] = useState(() => searchParams.get("fromPrice") || "");
    const [toPrice, setToPrice] = useState(() => searchParams.get("toPrice") || "");
    const [rating, setRating] = useState(() => searchParams.get("rating") || "");
    const [sortOption, setSortOption] = useState(() => searchParams.get("sort") || "");

    const debouncedDepartureLocation = useDebounce(departureLocation);
    const debouncedArrivalLocation = useDebounce(arrivalLocation);
    const debouncedDepartureTime = useDebounce(departureTime);
    const debouncedFromPrice = useDebounce(fromPrice);
    const debouncedToPrice = useDebounce(toPrice);
    const debouncedRating = useDebounce(rating);
    
    const [sortBy, order] = sortOption ? sortOption.split("|") : [];
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const { lookupTables } = useLookupTables();
    const pageSize = 5;
    const { currentUser } = useAuth();

    function buildBookingTransportation(option) {
        const baseInfo = option?.baseInfo || {};

        return {
            id: option?.id ?? baseInfo.id,
            name: baseInfo.name,
            departureLocation: option?.departureLocation,
            arrivalLocation: option?.arrivalLocation,
            departureTime: option?.departureTime,
            arrivalTime: option?.arrivalTime,
            pricePerTicket: baseInfo.price,
            availableSeats: baseInfo.remainingQuantity,
            quantity: baseInfo.quantity,
            image: baseInfo?.images?.[0]?.url,
            typeOfTransportation: option?.typeOfTransportation,
        };
    }

    const fetchPage = useCallback(
        (nextPage) => {
            const params = new URLSearchParams();

            if (debouncedDepartureLocation.trim()) params.append("departureLocation", debouncedDepartureLocation.trim());
            if (debouncedArrivalLocation.trim()) params.append("arrivalLocation", debouncedArrivalLocation.trim());
            if (typeOfTransportation) params.append("type", typeOfTransportation);
            if (debouncedDepartureTime) params.append("departureTime", debouncedDepartureTime);
            if (debouncedFromPrice) params.append("fromPrice", debouncedFromPrice);
            if (debouncedToPrice) params.append("toPrice", debouncedToPrice);
            if (debouncedRating) params.append("rating", debouncedRating);
            if (sortBy) params.append("sortBy", sortBy);
            if (order) params.append("order", order);
            
            params.append("page", nextPage);
            params.append("size", pageSize);

            return getTransportations(params.toString()).then((response) => {
                return Array.isArray(response)
                    ? response
                    : response?.content || response?.items || response?.results || [];
            });
        },
        [
            debouncedDepartureLocation,
            debouncedArrivalLocation,
            typeOfTransportation,
            debouncedDepartureTime,
            debouncedFromPrice,
            debouncedToPrice,
            debouncedRating,
            sortBy,
            order,
            pageSize
        ]
    );

    const {
        items: transportationList,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = useInfiniteScrollList({
        queryKey: [
            "transportations", 
            debouncedDepartureLocation, 
            debouncedArrivalLocation, 
            typeOfTransportation, 
            debouncedDepartureTime, 
            debouncedFromPrice, 
            debouncedToPrice, 
            debouncedRating, 
            sortBy, 
            order, 
            pageSize
        ],
        fetchPage, 
        pageSize,
    });

    useEffect(() => {
        const qDeparture = searchParams.get("departureLocation") || "";
        const qArrival = searchParams.get("arrivalLocation") || "";
        const qType = searchParams.get("type") || "";
        const qDepartureTime = searchParams.get("departureTime") || "";
        const qFrom = searchParams.get("fromPrice") || "";
        const qTo = searchParams.get("toPrice") || "";
        const qRating = searchParams.get("rating") || "";
        const qSort = searchParams.get("sort") || "";
        if (qDeparture !== departureLocation) setDepartureLocation(qDeparture);
        if (qArrival !== arrivalLocation) setArrivalLocation(qArrival);
        if (qType !== typeOfTransportation) setTypeOfTransportation(qType);
        if (qDepartureTime !== departureTime) setDepartureTime(qDepartureTime);
        if (qFrom !== fromPrice) setFromPrice(qFrom);
        if (qTo !== toPrice) setToPrice(qTo);
        if (qRating !== rating) setRating(qRating);
        if (qSort !== sortOption) setSortOption(qSort);

    }, [searchParams.toString()]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextDepartureLocation = debouncedDepartureLocation.trim();
        const nextArrivalLocation = debouncedArrivalLocation.trim();
        const nextDepartureTime = debouncedDepartureTime.trim();
        const nextFromPrice = debouncedFromPrice.trim();
        const nextToPrice = debouncedToPrice.trim();
        const nextRating = debouncedRating.trim();

        if (nextDepartureLocation) params.set("departureLocation", nextDepartureLocation); else params.delete("departureLocation");
        if (nextArrivalLocation) params.set("arrivalLocation", nextArrivalLocation); else params.delete("arrivalLocation");
        if (typeOfTransportation) params.set("type", typeOfTransportation); else params.delete("type");
        if (nextDepartureTime) params.set("departureTime", nextDepartureTime); else params.delete("departureTime");
        if (nextFromPrice) params.set("fromPrice", nextFromPrice); else params.delete("fromPrice");
        if (nextToPrice) params.set("toPrice", nextToPrice); else params.delete("toPrice");
        if (nextRating) params.set("rating", nextRating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            navigate({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedDepartureLocation, debouncedArrivalLocation, typeOfTransportation, debouncedDepartureTime, debouncedFromPrice, debouncedToPrice, debouncedRating, sortOption, searchParamsString, navigate]);

    function handleSelectTransportation(option) {
        if (!currentUser) {
            navigate("/login", { state: { from: window.location.pathname } });
            return;
        }

        setSelectedTransportation(buildBookingTransportation(option));
        setShowBookingModal(true);
    }

    const typeOfTransportationLabelMap = Object.fromEntries(
        (lookupTables.typeOfTransportations || []).map((option) => [option.value, option.label])
    );

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={2}>
                            <Form.Control
                                type="text"
                                placeholder="Điểm đi"
                                value={departureLocation}
                                onChange={(e) =>
                                    setDepartureLocation(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="text"
                                placeholder="Điểm đến"
                                value={arrivalLocation}
                                onChange={(e) =>
                                    setArrivalLocation(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Select
                                value={typeOfTransportation}
                                onChange={(e) => setTypeOfTransportation(e.target.value)}
                            >
                                <option value="">Loại phương tiện</option>
                                {(lookupTables.typeOfTransportations || []).map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        
                        <Col md={2}>
                            <Form.Control
                                type="number"
                                placeholder="Giờ xuất phát"
                                value={departureTime}
                                min="0"
                                max="23"
                                onChange={(e) =>
                                    setDepartureTime(e.target.value)
                                }
                            />
                        </Col>

                    </Row>

                    <Row className="g-2 align-items-center">
                        <Col md={2}>
                            <Form.Control
                                type="number"
                                min="0"
                                placeholder="Giá từ"
                                value={fromPrice}
                                onChange={(e) => setFromPrice(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                min="0"
                                placeholder="Giá đến"
                                value={toPrice}
                                onChange={(e) => setToPrice(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                placeholder="Rating từ"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="">Sắp xếp</option>
                                <option value="price|asc">Giá thấp đến cao</option>
                                <option value="price|desc">Giá cao đến thấp</option>
                                <option value="hot|desc">Hot nhất đến thấp</option>
                                <option value="hot|asc">Hot thấp đến cao</option>
                            </Form.Select>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <MySpinner />
                ) : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        initialLoad={false}
                        threshold={250}
                    >
                        <div className="d-flex flex-column gap-3">
                            {transportationList.map((option) => (
                                <TransportationItem
                                    key={option?.baseInfo?.id || `${option.departureLocation}-${option.arrivalLocation}`}
                                    {...option}
                                    typeOfTransportation={
                                        typeOfTransportationLabelMap[option?.typeOfTransportation] ||
                                        option?.typeOfTransportation ||
                                        "Loại phương tiện"
                                    }
                                    onSelect={() => handleSelectTransportation(option)}
                                />
                            ))}
                        </div>
                        {loadingMore ? <MySpinner /> : null}
                    </InfiniteScroll>
                )}

                <ModalConfirmTransportationBooking
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                    transportation={selectedTransportation}
                />
            </Container>
        </CustomerLayout>
    );
}

export default TransportationList;