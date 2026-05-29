/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TourItem from "@components/customer/CardTourItem";
import MySpinner from "@components/common/MySpinner";
import PaginationComponent from "@components/common/PaginationComponent";
import { getTourisms } from "@services/customerService";
import usePagedList from "@hooks/usePagedList";

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
    const { items: tourList, loading, page, totalPages, loadPage } = usePagedList(
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

                <div className="d-flex flex-column gap-3">
                    {tourList.map((tour) => (
                        <TourItem key={tour.id} {...tour} />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <PaginationComponent
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}

                {loading && <MySpinner />}
            </Container>
        </CustomerLayout>
    );
}

export default TourList;
