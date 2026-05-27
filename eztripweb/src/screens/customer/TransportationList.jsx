import React, { useState } from "react";
import { Container, Stack, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TransportationItem from "@components/customer/CardTransportationItem";
import ModalConfirmTransportationBooking from "@components/customer/ModalConfirmTransportationBooking";

const transportationOptions = [
    {
        name: "Hành trình A",
        type_of_transportation: "Xe khách",
        departure_location: "Hà Nội",
        arrival_location: "TP.HCM",
        departure_time: "08:00",
        arrival_time: "20:00",
        avaibility_count: 5,
        price: "500.000 VNĐ",
        rating: 8.5,
    },
];

function TransportationList() {
    const [departureLocation, setDepartureLocation] = useState("");
    const [arrivalLocation, setArrivalLocation] = useState("");
    const [typerOfTransportation, setTypeOfTransportation] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);

    function handleSelectTransportation(option) {
        setSelectedTransportation(option);
        setShowBookingModal(true);
    }
    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={2}>
                            <Form.Control
                                type="text"
                                placeholder="Điểm đi"
                                value={departureLocation}
                                onChange={(e) =>
                                    setDepartureLocation(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="text"
                                placeholder="Điểm đến"
                                value={arrivalLocation}
                                onChange={(e) =>
                                    setArrivalLocation(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control as ="select" value={typerOfTransportation} onChange={(e) => setTypeOfTransportation(e.target.value)}>
                                <option value="">Loại phương tiện</option>
                                <option value="Xe khách">Xe khách</option>
                                <option value="Máy bay">Máy bay</option>
                                <option value="Tàu hỏa">Tàu hỏa</option>
                            </Form.Control>
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                type="number"
                                placeholder="Giờ xuất phát"
                                value={departureTime}
                                onChange={(e) =>
                                    setDepartureTime(e.target.value)
                                }
                            />
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary">Tìm kiếm</Button>
                        </Col>
                    </Row>
                </Form>

                <div className="d-flex flex-column gap-3">
                    {transportationOptions.map((option) => (
                        <TransportationItem
                            name={option.name}
                            type_of_transportation={
                                option.type_of_transportation
                            }
                            departure_location={option.departure_location}
                            arrival_location={option.arrival_location}
                            departure_time={option.departure_time}
                            arrival_time={option.arrival_time}
                            avaibility_count={option.avaibility_count}
                            price={option.price}
                            rating={option.rating}
                            onSelect={() => handleSelectTransportation(option)}
                        />
                    ))}
                </div>

                <ModalConfirmTransportationBooking
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                    transportation={selectedTransportation}
                />
            </Container>
        </CustomerLayout>
    );
}

export default TransportationList;
