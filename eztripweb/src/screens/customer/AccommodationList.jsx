import React, { useState } from "react";
import { Container, Stack, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import CardAccomodationItem from "@components/customer/CardAccomodationItem";

const accommodations = [
    {
        id: 1,
        name: "Phòng VIP",
        providerName: "Khách sạn Hoa Hồng",
        location: "Phường Văn Xá, TP.HCM",
        quantity_of_bed: 2,
        area: 15,
        rating: 9.5,
        price: "300.000 VNĐ",
    },
];

function AccommodationList() {
    const [searchText, setSearchText] = useState("");
    const [beds, setBeds] = useState();
    const [area, setArea] = useState();

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3">
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
                                        onChange={(e) => setArea(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary">
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>


                <div md={12} className="h-50 d-flex flex-column gap-3">
                    {accommodations.map((accommodation) => (
                        <CardAccomodationItem
                            key={accommodation.id}
                            name={accommodation.name}
                            providerName={accommodation.providerName}
                            location={accommodation.location}
                            quantity_of_bed={accommodation.quantity_of_bed}
                            area={accommodation.area}
                            rating={accommodation.rating}
                            price={accommodation.price}
                        />
                    ))}
                </div>
                
            </Container>
        </CustomerLayout>
    );
}

export default AccommodationList;