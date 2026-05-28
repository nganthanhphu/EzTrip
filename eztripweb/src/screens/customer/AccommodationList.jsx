import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import CardAccomodationItem from "@components/customer/CardAccomodationItem";
import { getAccommodations } from "@services/customerService";

function AccommodationList() {
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [beds, setBeds] = useState("");
    const [area, setArea] = useState("");
    const [accommodationList, setAccommodationList] = useState([]);

    const loadAccommodations = async () => {
        try {
            setLoading(true);
            const response = await getAccommodations({
                beds,
                area,
            });
            setAccommodationList(response);
        } catch (error) {
            console.error("Error fetching accommodations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccommodations();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadAccommodations();
    };

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm (tên, nhà cung cấp, địa điểm)..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                placeholder="Số giường"
                                value={beds}
                                onChange={(e) => setBeds(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Row className="g-2">
                                <Col>
                                    <Form.Control
                                        type="number"
                                        placeholder="Diện tích (m²)"
                                        value={area}
                                        onChange={(e) =>
                                            setArea(e.target.value)
                                        }
                                    />
                                </Col>
                            </Row>
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

                <div md={12} className="h-50 d-flex flex-column gap-3">
                    {accommodationList.map((accommodation) => (
                        <CardAccomodationItem key={accommodation.id} {...accommodation}
                        />
                    ))}
                </div>

                {loading && <MySpinner />}
            </Container>
        </CustomerLayout>
    );
}

export default AccommodationList;