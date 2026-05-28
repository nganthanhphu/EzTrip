import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TransportationItem from "@components/customer/CardTransportationItem";
import ModalConfirmTransportationBooking from "@components/customer/ModalConfirmTransportationBooking";
import { useLookupTables } from "../../contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getTransportations } from "@services/customerService";

function TransportationList() {
    const [loading, setLoading] = useState(false);
    const [departureLocation, setDepartureLocation] = useState("");
    const [arrivalLocation, setArrivalLocation] = useState("");
    const [typeOfTransportation, setTypeOfTransportation] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [transportationList, setTransportationList] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const { lookupTables } = useLookupTables();

    const loadTransportations = async () => {
        try {
            setLoading(true);
            const response = await getTransportations({
                departureLocation,
                arrivalLocation,
                typeOfTransportation,
                departureTime,
            });

            setTransportationList(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Error fetching transportations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransportations();
    }, []);

    function handleSearch(event) {
        event.preventDefault();
        loadTransportations();
    }

    function handleSelectTransportation(option) {
        setSelectedTransportation(option);
        setShowBookingModal(true);
    }

    const typeOfTransportationLabelMap = Object.fromEntries(
        (lookupTables.typeOfTransportations || []).map((option) => [option.value, option.label])
    );

    return (
        <CustomerLayout>
            <Container className="py-4">
                <Form className="mb-3" onSubmit={handleSearch}>
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
                            <Form.Select
                                value={typeOfTransportation}
                                onChange={(e) => setTypeOfTransportation(e.target.value)}
                            >
                                <option value="">Loại phương tiện</option>
                                {(lookupTables.typeOfTransportations || []).map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        
                        {/* TODO: trong khoảng 0-23 */}
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
                            <Button variant="primary" type="submit" disabled={loading}>
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>

                <div className="d-flex flex-column gap-3">
                    {transportationList.map((option) => (
                        <TransportationItem
                            key={option?.baseInfo?.id || `${option.departureLocation}-${option.arrivalLocation}`}
                            {...option}
                            typeOfTransportation={
                                typeOfTransportationLabelMap[option?.typeOfTransportation] ||
                                option?.typeOfTransportation ||
                                "Loại phương tiện"
                            }
                            onSelect={() => handleSelectTransportation(option)}
                        />
                    ))}
                </div>

                {loading && <MySpinner />}

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
