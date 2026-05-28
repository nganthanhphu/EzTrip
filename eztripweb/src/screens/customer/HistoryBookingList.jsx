import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import HistoryBookingItem from "@components/customer/CardHistoryBookingItem";
import { useLookupTables } from "@contexts/LookupTablesContext";
import MySpinner from "@components/common/MySpinner";
import { getBookings } from "@services/customerService";

const handleChat = (item) => {
    console.log("Chat for", item);
};

const handlePrimary = (item) => {
    console.log("Primary action for", item);
};

function HistoryBookingList() {
    const [serviceType, setServiceType] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const { lookupTables } = useLookupTables();
    const typeOfServiceOptions = lookupTables.typeOfServices || [];

    const loadBookings = async () => {
        try {
            setLoading(true);

            const params = {};
            if (serviceType) {
                params.serviceType = Number(serviceType);
            }
            if (status) {
                params.status = status;
            }

            const response = await getBookings(params);
            const nextBookings = Array.isArray(response)
                ? response
                : response?.content || response?.data || response?.items || [];

            setBookings(nextBookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();
        loadBookings();
    };

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3" onSubmit={handleSearch}>
                    <Row className="g-2 align-items-center">
                        <Col md={2}>
                            <Form.Select
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                            >
                                <option value="">Loại dịch vụ</option>
                                {typeOfServiceOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2}>
                            <Form.Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Trạng thái</option>
                                {lookupTables.bookingStatuses.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary" type="submit" disabled={loading}>
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {loading ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {bookings.map((item) => (
                            <HistoryBookingItem
                                key={item.id}
                                serviceName={item.serviceName}
                                serviceType={item.serviceType}
                                serviceImage={item.serviceImage}
                                providerName={item.providerName}
                                createdDate={item.createdDate}
                                bookingDay={item.bookingDay}
                                paymentMethod={item.paymentMethod}
                                quantity={item.quantity}
                                totalAmount={item.totalAmount}
                                status={item.status}
                                note={item.note}
                                customerName={item.customerName}
                                customerPhone={item.customerPhone}
                                customerAvatar={item.customerAvatar}
                                review={item.review}
                                onChat={() => handleChat(item)}
                                onPrimaryAction={() => handlePrimary(item)}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </CustomerLayout>
    );
}

export default HistoryBookingList;
