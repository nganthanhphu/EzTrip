/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
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

function TransportationList() {
    const [name, setName] = useState("");
    const [departureLocation, setDepartureLocation] = useState("");
    const [arrivalLocation, setArrivalLocation] = useState("");
    const [typeOfTransportation, setTypeOfTransportation] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [rating, setRating] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [sortBy, order] = sortOption ? sortOption.split("|") : [];
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const { lookupTables } = useLookupTables();
    const pageSize = 5;
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

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

    const fetchTransportations = async (pageNumber = 1) => {
        const response = await getTransportations({
            name,
            departureLocation,
            arrivalLocation,
            type: typeOfTransportation,
            departureTime,
            fromPrice,
            toPrice,
            rating,
            sortBy,
            order,
            page: pageNumber,
            size: pageSize,
        });

        return Array.isArray(response)
            ? response
            : response?.content || response?.items || response?.results || [];
    };

    const {
        items: transportationList,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = useInfiniteScrollList({
        queryKey: ["transportations", name, departureLocation, arrivalLocation, typeOfTransportation, departureTime, fromPrice, toPrice, rating, sortBy, order, pageSize],
        fetchPage: fetchTransportations,
        pageSize,
    });

    useEffect(() => {
        const qName = searchParams.get("name") || "";
        const qDeparture = searchParams.get("departureLocation") || "";
        const qArrival = searchParams.get("arrivalLocation") || "";
        const qType = searchParams.get("type") || "";
        const qDepartureTime = searchParams.get("departureTime") || "";
        const qFrom = searchParams.get("fromPrice") || "";
        const qTo = searchParams.get("toPrice") || "";
        const qRating = searchParams.get("rating") || "";
        const qSort = searchParams.get("sort") || "";
        if (qName !== name) setName(qName);
        if (qDeparture !== departureLocation) setDepartureLocation(qDeparture);
        if (qArrival !== arrivalLocation) setArrivalLocation(qArrival);
        if (qType !== typeOfTransportation) setTypeOfTransportation(qType);
        if (qDepartureTime !== departureTime) setDepartureTime(qDepartureTime);
        if (qFrom !== fromPrice) setFromPrice(qFrom);
        if (qTo !== toPrice) setToPrice(qTo);
        if (qRating !== rating) setRating(qRating);
        if (qSort !== sortOption) setSortOption(qSort);

    }, [searchParams.toString()]);

    function handleSearch(event) {
        event.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (name) params.set("name", name); else params.delete("name");
        if (departureLocation) params.set("departureLocation", departureLocation); else params.delete("departureLocation");
        if (arrivalLocation) params.set("arrivalLocation", arrivalLocation); else params.delete("arrivalLocation");
        if (typeOfTransportation) params.set("type", typeOfTransportation); else params.delete("type");
        if (departureTime) params.set("departureTime", departureTime); else params.delete("departureTime");
        if (fromPrice) params.set("fromPrice", fromPrice); else params.delete("fromPrice");
        if (toPrice) params.set("toPrice", toPrice); else params.delete("toPrice");
        if (rating) params.set("rating", rating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");
        navigate(`?${params.toString()}`);
    }

    

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
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={2}>
                            <Form.Control
                                type="text"
                                placeholder="Tên dịch vụ"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>

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

                        <Col md={2} className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                Tìm kiếm
                            </Button>
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

                        <Col md={4}>
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
