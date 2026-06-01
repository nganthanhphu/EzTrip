/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroller";
import CustomerLayout from "@layouts/CustomerLayout";
import TourItem from "@components/customer/CardTourItem";
import MySpinner from "@components/common/MySpinner";
import { getTourisms } from "@services/customerService";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";

function TourList() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [tourDuration, setTourDuration] = useState("");
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [rating, setRating] = useState("");
    const [sortOption, setSortOption] = useState("");

    const [sortBy, order] = sortOption ? sortOption.split("|") : [];

    const pageSize = 5;
    const fetchPage = useCallback(
        (nextPage) =>
            getTourisms({
                name,
                location,
                tourDuration,
                fromPrice,
                toPrice,
                rating,
                sortBy,
                order,
                page: nextPage,
                size: pageSize,
            }),
        [name, location, tourDuration, fromPrice, toPrice, rating, sortBy, order, pageSize]
    );

    const {
        items: tourList,
        loading,
        loadingMore,
        hasMore,
        loadMore,
    } = useInfiniteScrollList({
        queryKey: ["tourisms", name, location, tourDuration, fromPrice, toPrice, rating, sortBy, order, pageSize],
        fetchPage,
        pageSize,
    });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // initialize from URL params and sync
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

    const handleSearch = (event) => {
        event.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (name) params.set("name", name); else params.delete("name");
        if (location) params.set("location", location); else params.delete("location");
        if (tourDuration) params.set("tourDuration", tourDuration); else params.delete("tourDuration");
        if (fromPrice) params.set("fromPrice", fromPrice); else params.delete("fromPrice");
        if (toPrice) params.set("toPrice", toPrice); else params.delete("toPrice");
        if (rating) params.set("rating", rating); else params.delete("rating");
        if (sortOption) params.set("sort", sortOption); else params.delete("sort");
        params.delete("page");
        navigate(`?${params.toString()}`);
    };

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center mb-2">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="Tên tour"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Control
                                type="text"
                                placeholder="Địa điểm"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                placeholder="Thời lượng (ngày)"
                                value={tourDuration}
                                onChange={(e) =>
                                    setTourDuration(e.target.value)
                                }
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
