import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TourItem from "@components/customer/CardTourItem";
import MySpinner from "@components/common/MySpinner";
import { getTourisms } from "@services/customerService";

function TourList() {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [tourDuration, setTourDuration] = useState("");
    const [tourList, setTourList] = useState([]);

    const loadTours = async () => {
        try {
            setLoading(true);
            const response = await getTourisms({
                searchText,
                tourDuration,
            });

            setTourList(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error fetching tours:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTours();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadTours();
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

                {loading && <MySpinner />}
            </Container>
        </CustomerLayout>
    );
}

export default TourList;
