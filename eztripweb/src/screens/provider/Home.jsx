import {
    Badge,
    Card,
    Col,
    Container,
    ListGroup,
    ProgressBar,
    Row,
    Stack,
} from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";

function Home() {
    return (
        <ProviderLayout>
            <Container className="py-4 py-lg-5">
                <Card className="border-0 shadow-sm mb-4 mb-lg-5">
                    <Card.Body className="p-4 p-lg-5">
                        <Stack
                            direction="horizontal"
                            className="justify-content-between flex-wrap"
                            gap={2}
                        >
                            <div>
                                <Badge bg="success" className="mb-3">
                                    KHÔNG GIAN NHÀ CUNG CẤP
                                </Badge>
                                <h1 className="display-6 fw-bold mb-2">
                                    Chào mừng đến với cổng thông tin nhà cung cấp EzTrip
                                </h1>
                                <p className="text-secondary mb-0">
                                    Không gian tập trung giúp theo dõi đơn đặt, tối ưu
                                    hiệu quả vận hành dịch vụ và nâng cao trải nghiệm khách
                                    hàng.
                                </p>
                            </div>
                            <Card className="border-0 bg-light">
                                <Card.Body className="py-2 px-3">
                                    <small className="text-secondary d-block">
                                        Tuần này
                                    </small>
                                    <strong>+12.4% tăng trưởng đơn đặt</strong>
                                </Card.Body>
                            </Card>
                        </Stack>
                    </Card.Body>
                </Card>

                <Row className="g-3 g-lg-4 mb-4 mb-lg-5">
                    <Col sm={6} xl={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Tổng số dịch vụ
                                </p>
                                <h3 className="mb-1 fw-bold">96</h3>
                                <small className="text-success">+4 trong tháng</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6} xl={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Đơn mới
                                </p>
                                <h3 className="mb-1 fw-bold">142</h3>
                                <small className="text-success">+9.2% so với tuần trước</small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6} xl={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Tỷ lệ hoàn tất
                                </p>
                                <h3 className="mb-1 fw-bold">91%</h3>
                                <small className="text-secondary">
                                    Chất lượng phục vụ ổn định
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6} xl={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Đánh giá trung bình
                                </p>
                                <h3 className="mb-1 fw-bold">4.7/5</h3>
                                <small className="text-secondary">
                                    Tổng hợp từ đánh giá gần đây
                                </small>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={7}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-white border-0 pt-4 px-4">
                                <h4 className="mb-1">Tổng quan vận hành</h4>
                                <p className="text-secondary mb-0">
                                    Bức tranh tổng hợp tình hình hoạt động hiện tại.
                                </p>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4">
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="px-0">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Độ phủ hiển thị dịch vụ</span>
                                            <span className="text-secondary">85%</span>
                                        </div>
                                        <ProgressBar now={85} variant="success" />
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Tốc độ xác nhận đơn</span>
                                            <span className="text-secondary">78%</span>
                                        </div>
                                        <ProgressBar now={78} variant="info" />
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Tỷ lệ quay lại của khách</span>
                                            <span className="text-secondary">73%</span>
                                        </div>
                                        <ProgressBar now={73} variant="warning" />
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0 pb-0">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span>Chỉ số chất lượng dịch vụ</span>
                                            <span className="text-secondary">90%</span>
                                        </div>
                                        <ProgressBar now={90} variant="primary" />
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-white border-0 pt-4 px-4">
                                <h4 className="mb-1">Lộ trình nhà cung cấp</h4>
                                <p className="text-secondary mb-0">
                                    Quy trình đề xuất để mở rộng và tối ưu vận hành.
                                </p>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4">
                                <Stack gap={3}>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">1. Xây dựng danh mục</h6>
                                            <p className="mb-0 text-secondary">
                                                Đăng tải mô tả rõ ràng, khả năng phục vụ và
                                                điểm khác biệt của từng dịch vụ.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">2. Xử lý yêu cầu đặt</h6>
                                            <p className="mb-0 text-secondary">
                                                Xác nhận đơn kịp thời để tăng độ tin cậy và
                                                tỷ lệ chốt đơn từ khách hàng.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">3. Cải tiến liên tục</h6>
                                            <p className="mb-0 text-secondary">
                                                Theo dõi hiệu suất và phản hồi để nâng cấp chất
                                                lượng dịch vụ theo thời gian.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </ProviderLayout>
    );
}

export default Home;