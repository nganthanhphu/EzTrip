/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import CardAccommodationItem from "@components/customer/CardAccommodationItem";
import { getAccommodations } from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";

function AccommodationList() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [rating, setRating] = useState("");
    const [sortOption, setSortOption] = useState("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const pageSize = 5;
    const fetchPage = useCallback(
        (nextPage) =>
            getAccommodations({
                name,
                location,
                fromPrice,
                toPrice,
                rating,
                sortBy,
                order,
                page: nextPage,
                size: pageSize,
            }),
        [name, location, fromPrice, toPrice, rating, sortBy, order, pageSize]
    );

    const {
        items: accommodationList,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = useInfiniteScrollList({
        queryKey: ["accommodations", name, location, fromPrice, toPrice, rating, sortBy, order, pageSize],
        fetchPage,
        pageSize,
    });


    const handleSearch = (event) => {
        event.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (name) params.set("name", name); else params.delete("name");
        if (location) params.set("location", location); else params.delete("location");
        if (fromPrice) params.set("fromPrice", fromPrice); else params.delete("fromPrice");
        if (toPrice) params.set("toPrice", toPrice); else params.delete("toPrice");
        if (rating) params.set("rating", rating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");
        navigate(`?${params.toString()}`);
    };

    const handleSortChange = (event) => {
        const value = event.target.value;
        setSortOption(value);
        const params = new URLSearchParams(searchParams);
        if (name) params.set("name", name); else params.delete("name");
        if (location) params.set("location", location); else params.delete("location");
        if (fromPrice) params.set("fromPrice", fromPrice); else params.delete("fromPrice");
        if (toPrice) params.set("toPrice", toPrice); else params.delete("toPrice");
        if (rating) params.set("rating", rating); else params.delete("rating");
        if (value) params.set("sort", value); else params.delete("sort");
        params.delete("page");
        navigate(`?${params.toString()}`);
    };

    useEffect(() => {
        const query = searchParams;
        const qName = query.get("name") || "";
        const qLocation = query.get("location") || "";
        const qFrom = query.get("fromPrice") || "";
        const qTo = query.get("toPrice") || "";
        const qRating = query.get("rating") || "";
        const qSort = query.get("sort") || "";

        if (qName !== name) setName(qName);
        if (qLocation !== location) setLocation(qLocation);
        if (qFrom !== fromPrice) setFromPrice(qFrom);
        if (qTo !== toPrice) setToPrice(qTo);
        if (qRating !== rating) setRating(qRating);
        if (qSort !== sortOption) setSortOption(qSort);

    }, [searchParams.toString()]);

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm theo tên chỗ ở"
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

                        <Col md={3} className="d-grid">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                Tìm kiếm
                            </Button>
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

                        <Col md={4}>
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