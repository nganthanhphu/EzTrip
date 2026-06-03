import { Badge, Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";

function Home() {
    return (
        <CustomerLayout>
            <div className="bg-light py-5 mb-5 border-bottom">
                <Container className="py-lg-5 text-center">
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <Badge bg="primary" pill className="px-3 py-2 mb-3 shadow-sm">
                                NỀN TẢNG DU LỊCH TOÀN DIỆN
                            </Badge>
                            <h1 className="display-4 fw-bold mb-4 text-dark">
                                Khám phá thế giới, <br />
                                <span className="text-primary">theo cách của bạn.</span>
                            </h1>
                            <p className="lead text-secondary mb-5 px-md-4">
                                EzTrip mang đến trải nghiệm đặt dịch vụ liền mạch (Seamless Experience). 
                                Từ những trạm dừng chân ấm cúng, những chuyến xe an toàn, đến các tour du lịch đầy cảm hứng — tất cả hội tụ trong một nền tảng duy nhất.
                            </p>
                            <Stack direction="horizontal" gap={3} className="justify-content-center">
                                <Button as={Link} to="/accommodations" variant="outline-primary" size="lg" className="px-4 rounded-pill">
                                    Các dịch vụ lưu trú
                                </Button>
                                <Button as={Link} to="/transportations" variant="outline-primary" size="lg" className="px-4 rounded-pill">
                                    Các dịch vụ di chuyển
                                </Button>
                                <Button as={Link} to="/tours" variant="outline-primary" size="lg" className="px-4 rounded-pill">
                                    Các tour nổi bật
                                </Button>
                            </Stack>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mb-5 pb-lg-5">
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3">Mọi thứ bạn cần cho một chuyến đi</h2>
                    <p className="text-secondary fs-5">Hệ sinh thái dịch vụ đa dạng, đáp ứng mọi nhu cầu xê dịch.</p>
                </div>

                <Row className="g-4">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center hover-lift">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">🏨</div>
                                <h4 className="fw-bold mb-3">Lưu trú đa dạng</h4>
                                <p className="text-secondary mb-0">
                                    Hàng ngàn lựa chọn từ khách sạn sang trọng, khu nghỉ dưỡng (Resort) đến các homestay đậm chất địa phương.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center hover-lift">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">🚌</div>
                                <h4 className="fw-bold mb-3">Di chuyển dễ dàng</h4>
                                <p className="text-secondary mb-0">
                                    Đặt vé xe khách, xe Limousine tiện lợi với mạng lưới đối tác vận tải uy tín, phủ sóng rộng khắp.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center hover-lift">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">🏕️</div>
                                <h4 className="fw-bold mb-3">Trải nghiệm độc đáo</h4>
                                <p className="text-secondary mb-0">
                                    Các tour du lịch được thiết kế chuyên biệt, mang lại những khoảnh khắc đáng nhớ và an toàn tuyệt đối.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <div className="bg-primary bg-opacity-10 py-5">
                <Container className="py-lg-4">
                    <Row className="align-items-center g-5">
                        <Col lg={6}>
                            <h2 className="fw-bold mb-4">Tại sao khách hàng tin chọn EzTrip?</h2>
                            <Stack gap={4}>
                                <div className="d-flex">
                                    <div className="me-3 fs-3">⚡</div>
                                    <div>
                                        <h5 className="fw-bold">Nhanh chóng & Tiện lợi</h5>
                                        <p className="text-secondary mb-0">Hệ thống xử lý giao dịch (Transaction Processing) tức thì, xác nhận đặt chỗ chỉ trong vài thao tác.</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="me-3 fs-3">🛡️</div>
                                    <div>
                                        <h5 className="fw-bold">Bảo mật tuyệt đối</h5>
                                        <p className="text-secondary mb-0">Dữ liệu cá nhân và thông tin thanh toán được mã hóa an toàn theo tiêu chuẩn cao nhất.</p>
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <div className="me-3 fs-3">💬</div>
                                    <div>
                                        <h5 className="fw-bold">Kết nối trực tiếp</h5>
                                        <p className="text-secondary mb-0">Khả năng nhắn tin trực tiếp (Direct Messaging) với nhà cung cấp giúp giải đáp mọi thắc mắc ngay lập tức.</p>
                                    </div>
                                </div>
                            </Stack>
                        </Col>
                        <Col lg={6}>
                            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                                <Card.Body className="p-5 text-center bg-white">
                                    <Badge bg="success" className="mb-3 px-3 py-2">Thống kê nền tảng</Badge>
                                    <h3 className="fw-bold mb-4">Cộng đồng đang lớn mạnh từng ngày</h3>
                                    <Row className="g-4">
                                        <Col xs={6}>
                                            <h2 className="fw-bold text-primary mb-1">2,500+</h2>
                                            <p className="text-secondary small mb-0">Dịch vụ đang hoạt động</p>
                                        </Col>
                                        <Col xs={6}>
                                            <h2 className="fw-bold text-primary mb-1">18k+</h2>
                                            <p className="text-secondary small mb-0">Giao dịch hàng tháng</p>
                                        </Col>
                                        <Col xs={6}>
                                            <h2 className="fw-bold text-primary mb-1">200+</h2>
                                            <p className="text-secondary small mb-0">Đối tác uy tín</p>
                                        </Col>
                                        <Col xs={6}>
                                            <h2 className="fw-bold text-primary mb-1">4.8/5</h2>
                                            <p className="text-secondary small mb-0">Đánh giá hài lòng</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </CustomerLayout>
    );
}

export default Home;