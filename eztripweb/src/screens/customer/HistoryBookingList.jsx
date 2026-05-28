import React, { useState } from "react";
import { Container, Stack, Row, Col, Form, Button } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import HistoryBookingItem from "../../components/customer/CardHistoryBookingItem";
import { useLookupTables } from "../../contexts/LookupTablesContext";

const HistoryBookingItems = [
    {
        name_of_service: "Phòng VIP",
        type_of_service: "Khách sạn",
        name_of_provider: "Khách sạn Hoa Hồng",
        created_at: "25/05/2026",
        booking_day: "26/05/2026",
        payment_method: "Momo",
        quantity: 1,
        total_amount: "150.000 VNĐ",
        status: "Pending",
    },
    {
        name_of_service: "Tour Sài Gòn",
        type_of_service: "Tour",
        name_of_provider: "Công ty Du Lịch ABC",
        created_at: "20/05/2026",
        booking_day: "22/05/2026",
        payment_method: "Thẻ tín dụng",
        quantity: 2,
        total_amount: "1.200.000 VNĐ",
        status: "Confirmed",
    },
    {
        name_of_service: "Vé Xe",
        type_of_service: "Vận chuyển",
        name_of_provider: "Xe khách Phương Trang",
        created_at: "10/05/2026",
        booking_day: "15/05/2026",
        payment_method: "Tiền mặt",
        quantity: 1,
        total_amount: "200.000 VNĐ",
        status: "Completed",
    },
];

const handleChat = (item) => {
    console.log("Chat for", item);
};

const handlePrimary = (item) => {
    console.log("Primary action for", item);
};

function HistoryBookingList() {
    const [searchText, setSearchText] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [status, setStatus] = useState("");
    const { lookupTables } = useLookupTables();

    return (
        <CustomerLayout>
            <Container className="p-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm (tên dịch vụ, nhà cung cấp)"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                as="select"
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                            >
                                <option value="">Loại dịch vụ</option>
                                {lookupTables.typeOfProviders.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Trạng thái</option>
                                {lookupTables.bookingStatuses.map(
                                    (option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ),
                                )}
                            </Form.Control>
                        </Col>

                        <Col md={2} className="d-grid">
                            <Button variant="primary">Tìm kiếm</Button>
                        </Col>
                    </Row>
                </Form>

                <div className="d-flex flex-column gap-3">
                    {HistoryBookingItems.map((item, index) => {
                        console.log("Rendering history item", index, item);
                        return (
                            <HistoryBookingItem
                                key={index}
                                name_of_service={item.name_of_service}
                                type_of_service={item.type_of_service}
                                name_of_provider={item.name_of_provider}
                                created_at={item.created_at}
                                booking_day={item.booking_day}
                                payment_method={item.payment_method}
                                quantity={item.quantity}
                                total_amount={item.total_amount}
                                status={item.status}
                                onChat={() => handleChat(item)}
                                onPrimaryAction={() => handlePrimary(item)}
                            />
                        );
                    })}
                </div>
            </Container>
        </CustomerLayout>
    );
}

export default HistoryBookingList;
