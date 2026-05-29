/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import TransportationItem from "@components/customer/CardTransportationItem";
import ModalConfirmTransportationBooking from "@components/customer/ModalConfirmTransportationBooking";
import PaginationComponent from "@components/common/PaginationComponent";
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
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const { lookupTables } = useLookupTables();
    const pageSize = 5;

    function buildBookingTransportation(option) {
        const baseInfo = option?.baseInfo || {};

        return {
            id: option?.id ?? baseInfo.id,
            name: baseInfo.name,
            departureLocation: option?.departureLocation,
            arrivalLocation: option?.arrivalLocation,
            departureTime: option?.departureTime,
            arrivalTime: option?.arrivalTime,
            pricePerTicket: baseInfo.price,
            availableSeats: baseInfo.remainingQuantity,
            quantity: baseInfo.quantity,
            image: baseInfo?.images?.[0]?.url,
            typeOfTransportation: option?.typeOfTransportation,
        };
    }

    const loadTransportations = async (pageNumber = 1) => {
        try {
            setLoading(true);
            const response = await getTransportations({
                departureLocation,
                arrivalLocation,
                type: typeOfTransportation,
                departureTime,
                page: pageNumber,
                size: pageSize,
            });

            const items = Array.isArray(response)
                ? response
                : response?.content || response?.items || response?.results || [];

            setTransportationList(items);
            setHasNextPage(items.length === pageSize);
        } catch (error) {
            console.error("Error fetching transportations:", error);
            setTransportationList([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransportations();
    }, []);

    function handleSearch(event) {
        event.preventDefault();
        setPage(1);
        loadTransportations(1);
    }

    function handlePageChange(nextPage) {
        setPage(nextPage);
        loadTransportations(nextPage);
    }

    const totalPages = hasNextPage ? page + 1 : page;

    function handleSelectTransportation(option) {
        setSelectedTransportation(buildBookingTransportation(option));
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
