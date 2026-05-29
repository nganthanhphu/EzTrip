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
    const [searchText, setSearchText] = useState("");
    const [tourDuration, setTourDuration] = useState("");

    const pageSize = 5;
    const { items: tourList, loading, page, totalPages, loadPage } = usePagedList(
        (nextPage) =>
            getTourisms({
                searchText,
                tourDuration,
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
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm (tên tour, địa điểm, nhà cung cấp)..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Control
                                type="number"
                                placeholder="Thời lượng (ngày)"
                                value={tourDuration}
                                onChange={(e) =>
                                    setTourDuration(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                Tìm kiếm
                            </Button>
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
