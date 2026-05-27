import React, { useState } from "react";
import { Container, Stack, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TourItem from "@components/customer/CardTourItem";
import defaultImage from "../../assets/images/default_tour_item.jpg";

const tours = [
    {
        id: 1,
        name: "Tour Hà Nội - Hạ Long",
        providerName: "Công ty du lịch ABC",
        location: "Hà Nội - Hạ Long",
        price: "1.000.000 VNĐ",
        rating: 9.0,
        avaibility_count: 10,
        tour_duration: "2 ngày 1 đêm",
        image: defaultImage
    }
]

function TourList() {
    const [searchText, setSearchText] = useState("");
    const [tourDuration, setTourDuration] = useState("");

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm (tên tour, địa điểm)"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Control
                                type="number"
                                placeholder="Thời lượng (ngày)"
                                value={tourDuration}
                                onChange={(e) => setTourDuration(e.target.value)}
                            />
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary">
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>
                

                {tours.map((tour) => (
                    <TourItem
                        key={tour.id}
                        name={tour.name}
                        providerName={tour.providerName}
                        location={tour.location}
                        price={tour.price}
                        rating={tour.rating}
                        avaibility_count={tour.avaibility_count}
                        tour_duration={tour.tour_duration}
                        imageUrl={tour.image}
                    />
                ))}
            </Container>
        </CustomerLayout>
    );
}

export default TourList;
