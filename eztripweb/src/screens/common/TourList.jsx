/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import TourItem from "@components/customer/CardTourItem";
import MySpinner from "@components/common/MySpinner";
import customerService from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";

function TourList() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();
    
    const [name, setName] = useState(() => searchParams.get("name") || "");
    const [location, setLocation] = useState(() => searchParams.get("location") || "");
    const [tourDuration, setTourDuration] = useState(() => searchParams.get("tourDuration") || "");
    const [fromPrice, setFromPrice] = useState(() => searchParams.get("fromPrice") || "");
    const [toPrice, setToPrice] = useState(() => searchParams.get("toPrice") || "");
    const [rating, setRating] = useState(() => searchParams.get("rating") || "");
    const [sortOption, setSortOption] = useState(() => searchParams.get("sort") || "");
    const debouncedName = useDebounce(name);
    const debouncedLocation = useDebounce(location);
    const debouncedTourDuration = useDebounce(tourDuration);
    const debouncedFromPrice = useDebounce(fromPrice);
    const debouncedToPrice = useDebounce(toPrice);
    const debouncedRating = useDebounce(rating);

    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const fetchPage = useCallback(
    (nextPage) => {
        const params = new URLSearchParams();

        if (debouncedName.trim()) params.append("name", debouncedName.trim());
        if (debouncedLocation.trim()) params.append("location", debouncedLocation.trim());
        if (debouncedTourDuration) params.append("tourDuration", debouncedTourDuration);
        if (debouncedFromPrice) params.append("fromPrice", debouncedFromPrice);
        if (debouncedToPrice) params.append("toPrice", debouncedToPrice);
        if (debouncedRating) params.append("rating", debouncedRating);
        if (sortBy) params.append("sortBy", sortBy);
        if (order) params.append("order", order);
        
        params.append("page", nextPage);

        return customerService.getTourisms(params.toString());
    },
    [debouncedName, debouncedLocation, debouncedTourDuration, debouncedFromPrice, debouncedToPrice, debouncedRating, sortBy, order]
);

    const {
        items: tourList,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = useInfiniteScrollList({
        queryKey: ["tourisms", debouncedName, debouncedLocation, debouncedTourDuration, debouncedFromPrice, debouncedToPrice, debouncedRating, sortBy, order],
        fetchPage
    });

    useEffect(() => {
        const qName = searchParams.get("name") || "";
        const qLocation = searchParams.get("location") || "";
        const qDuration = searchParams.get("tourDuration") || "";
        const qFrom = searchParams.get("fromPrice") || "";
        const qTo = searchParams.get("toPrice") || "";
        const qRating = searchParams.get("rating") || "";
        const qSort = searchParams.get("sort") || "";

        if (qName !== name) setName(qName);
        if (qLocation !== location) setLocation(qLocation);
        if (qDuration !== tourDuration) setTourDuration(qDuration);
        if (qFrom !== fromPrice) setFromPrice(qFrom);
        if (qTo !== toPrice) setToPrice(qTo);
        if (qRating !== rating) setRating(qRating);
        if (qSort !== sortOption) setSortOption(qSort);
    }, [searchParams.toString()]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextName = debouncedName.trim();
        const nextLocation = debouncedLocation.trim();
        const nextTourDuration = debouncedTourDuration.trim();
        const nextFromPrice = debouncedFromPrice.trim();
        const nextToPrice = debouncedToPrice.trim();
        const nextRating = debouncedRating.trim();

        if (nextName) params.set("name", nextName); else params.delete("name");
        if (nextLocation) params.set("location", nextLocation); else params.delete("location");
        if (nextTourDuration) params.set("tourDuration", nextTourDuration); else params.delete("tourDuration");
        if (nextFromPrice) params.set("fromPrice", nextFromPrice); else params.delete("fromPrice");
        if (nextToPrice) params.set("toPrice", nextToPrice); else params.delete("toPrice");
        if (nextRating) params.set("rating", nextRating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            navigate({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedName, debouncedLocation, debouncedTourDuration, debouncedFromPrice, debouncedToPrice, debouncedRating, sortOption, searchParamsString, navigate]);

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Tên tour"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>

                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Địa điểm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Col>

                        <Col md={4}>
                            <Form.Control
                                type="number"
                                placeholder="Thời lượng (ngày)"
                                value={tourDuration}
                                onChange={(e) =>
                                    setTourDuration(e.target.value)
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
                            {tourList.map((tour) => (
                                <TourItem key={tour.id} {...tour} />
                            ))}
                        </div>
                        {loadingMore ? <MySpinner /> : null}
                    </InfiniteScroll>
                )}
            </Container>
        </CustomerLayout>
    );
}

export default TourList;
