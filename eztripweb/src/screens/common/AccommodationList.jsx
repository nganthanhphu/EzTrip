/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import CardAccommodationItem from "@components/customer/CardAccommodationItem";
import { getAccommodations } from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";
import useDebounce from "@hooks/useDebounce";

function AccommodationList() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [rating, setRating] = useState("");
    const [sortOption, setSortOption] = useState("");
    const debouncedName = useDebounce(name);
    const debouncedLocation = useDebounce(location);
    const debouncedFromPrice = useDebounce(fromPrice);
    const debouncedToPrice = useDebounce(toPrice);
    const debouncedRating = useDebounce(rating);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const pageSize = 5;
    const fetchPage = useCallback(
        (nextPage) =>
            getAccommodations({
                name: debouncedName.trim(),
                location: debouncedLocation.trim(),
                fromPrice: debouncedFromPrice,
                toPrice: debouncedToPrice,
                rating: debouncedRating,
                sortBy,
                order,
                page: nextPage,
                size: pageSize,
            }),
        [debouncedName, debouncedLocation, debouncedFromPrice, debouncedToPrice, debouncedRating, sortBy, order, pageSize]
    );

    const {
        items: accommodationList,
        loading,
        loadingMore,
        hasMore,
        loadMore, 
    } = useInfiniteScrollList({
        queryKey: ["accommodations", debouncedName, debouncedLocation, debouncedFromPrice, debouncedToPrice, debouncedRating, sortBy, order, pageSize],
        fetchPage,
        pageSize,
    });

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    useEffect(() => {
        const qName = searchParams.get("name") || "";
        const qLocation = searchParams.get("location") || "";
        const qFrom = searchParams.get("fromPrice") || "";
        const qTo = searchParams.get("toPrice") || "";
        const qRating = searchParams.get("rating") || "";
        const qSort = searchParams.get("sort") || "";

        if (qName !== name) setName(qName);
        if (qLocation !== location) setLocation(qLocation);
        if (qFrom !== fromPrice) setFromPrice(qFrom);
        if (qTo !== toPrice) setToPrice(qTo);
        if (qRating !== rating) setRating(qRating);
        if (qSort !== sortOption) setSortOption(qSort);

    }, [searchParams.toString()]);

    useEffect(() => {
        const params = new URLSearchParams(searchParamsString);
        const nextName = debouncedName.trim();
        const nextLocation = debouncedLocation.trim();
        const nextFromPrice = debouncedFromPrice.trim();
        const nextToPrice = debouncedToPrice.trim();
        const nextRating = debouncedRating.trim();

        if (nextName) params.set("name", nextName); else params.delete("name");
        if (nextLocation) params.set("location", nextLocation); else params.delete("location");
        if (nextFromPrice) params.set("fromPrice", nextFromPrice); else params.delete("fromPrice");
        if (nextToPrice) params.set("toPrice", nextToPrice); else params.delete("toPrice");
        if (nextRating) params.set("rating", nextRating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");

        const nextSearch = params.toString();
        if (nextSearch !== searchParamsString) {
            navigate({ pathname: window.location.pathname, search: nextSearch ? `?${nextSearch}` : "" }, { replace: true });
        }
    }, [debouncedName, debouncedLocation, debouncedFromPrice, debouncedToPrice, debouncedRating, sortOption, searchParamsString, navigate]);

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên chỗ ở"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
                            <Form.Control
                                type="text"
                                placeholder="Địa điểm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row className="g-2 align-items-center mb-3">
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
                                max="10"
                                step="0.1"
                                placeholder="Rating từ"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            />
                        </Col>

                        <Col md={6}>
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
                            {accommodationList.map((accommodation) => (
                                <CardAccommodationItem
                                    key={accommodation.id}
                                    {...accommodation}
                                />
                            ))}
                        </div>
                        {loadingMore ? <MySpinner /> : null}
                    </InfiniteScroll>
                )}
            </Container>
        </CustomerLayout>
    );
}

export default AccommodationList;