import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Stack, Row, Col, Form, Button } from "react-bootstrap";
import CardServiceItem from "@components/provider/CardServiceItem";

import ProviderLayout from "@layouts/ProviderLayout";

const services = [
    {
        id: 1,
        name: "Hành trình A",
        description: "Mô tả hành trình A",
        price: 450000,
        quantity: 1,
        type_of_service_id: 1,
        type_of_service_name: "Tour du lịch",
        is_active: true,
        image: null
    }
];

function ServiceList() {
    const [searchText, setSearchText] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    return (
        <ProviderLayout>
            <Container className="py-4">
                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control
                                type="text"
                                placeholder="Tìm kiếm tên dịch vụ"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </Col>

                        <Col md={2}>
                            <Form.Control
                                as="select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">Trạng thái</option>
                                <option value="Pending">Đang chờ</option>
                                <option value="Confirmed">Đã xác nhận</option>
                                <option value="Completed">Hoàn thành</option>
                            </Form.Control>
                        </Col>
                        
                        <Col md={2} className="d-grid">
                            <Button variant="primary">Tìm kiếm</Button>
                        </Col>
                    </Row>
                </Form>

                <div md={12} className="h-50 d-flex flex-column gap-3">
                    {services.map((service) => (
                        <CardServiceItem
                            key={service.id}
                            id={service.id}
                            name={service.name}
                            description={service.description}
                            price={service.price}
                            quantity={service.quantity}
                            type_of_service_id={service.type_of_service_id}
                            type_of_service_name={service.type_of_service_name}
                            image={service.image}
                            onOpenBookings={() => navigate(`/provider/services/${service.id}/BookingList`)}
                        />
                    ))}
                            
                </div>
            </Container>
        </ProviderLayout>
    );
}

export default ServiceList;
