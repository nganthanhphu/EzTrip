import { useParams } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";
import CardBookingItem from "@components/provider/CardBookingItem";

const bookingItems = [
    {
        customer_name: "Hoang Phi Hung",
        customer_phone: "0706 823 664",
        customer_email: "nvvach.aider@gmail.com",
        customer_dob: "29/02/2005",
        customer_gender: "Nam",
        created_date: "25/05/2026",
        booking_day: "26/05/2026",
        payment_method: "Momo",
        quantity: 5,
        total_amount: "150.000 VNĐ",
        status: "Pending",
    },
    {
        customer_name: "Hoang Phi Hung",
        customer_phone: "0706 823 664",
        customer_email: "nvvach.aider@gmail.com",
        customer_dob: "29/02/2005",
        customer_gender: "Nam",
        created_date: "24/05/2026",
        booking_day: "26/05/2026",
        payment_method: "Momo",
        quantity: 2,
        total_amount: "300.000 VNĐ",
        status: "Confirmed",
    },
];

function BookingList() {
    const { id } = useParams();

    return (
        <ProviderLayout>
            <Container className="py-4">
                <div className="d-flex flex-column gap-2 mb-4">
                    <h1 className="mb-0">Danh sách booking</h1>
                    <div className="text-secondary">Service ID: {id}</div>
                </div>

                <Form className="mb-3">
                    <Row className="g-2 align-items-center">
                        <Col md={5}>
                            <Form.Control type="text" placeholder="Tìm kiếm khách hàng" />
                        </Col>
                        <Col md={3}>
                            <Form.Select>
                                <option value="">Trạng thái</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                        </Col>
                        <Col md={2} className="d-grid">
                            <Button variant="primary">Tìm kiếm</Button>
                        </Col>
                    </Row>
                </Form>

                <div className="d-flex flex-column gap-3">
                    {bookingItems.map((item, index) => (
                        <CardBookingItem
                            key={index}
                            customer_name={item.customer_name}
                            customer_phone={item.customer_phone}
                            customer_email={item.customer_email}
                            customer_dob={item.customer_dob}
                            customer_gender={item.customer_gender}
                            created_date={item.created_date}
                            booking_day={item.booking_day}
                            payment_method={item.payment_method}
                            quantity={item.quantity}
                            total_amount={item.total_amount}
                            status={item.status}
                            onChat={() => console.log("Chat ngay", item)}
                            onConfirm={() => console.log("Confirm booking", item)}
                            onCancel={() => console.log("Cancel booking", item)}
                            onComplete={() => console.log("Complete booking", item)}
                        />
                    ))}
                </div>
            </Container>
        </ProviderLayout>
    );
}

export default BookingList;