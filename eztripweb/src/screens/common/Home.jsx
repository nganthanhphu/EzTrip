import {
    Badge,
    Card,
    Col,
    Container,
    ListGroup,
    Row,
    Stack,
} from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";

function Home() {
    return (
        <CustomerLayout>
            <Container className="py-4 py-lg-5">
                <Card className="border-0 shadow-sm mb-4 mb-lg-5">
                    <Card.Body className="p-4 p-lg-5">
                        <Badge bg="primary" className="mb-3">
                            NỀN TẢNG EZTRIP
                        </Badge>
                        <h1 className="display-6 fw-bold mb-3">
                            Khám phá, đặt dịch vụ và quản lý hành trình trên cùng một hệ thống
                        </h1>
                        <p className="text-secondary mb-4 fs-5">
                            EzTrip là hệ sinh thái du lịch hợp nhất, kết nối khách hàng
                            với lưu trú, vận chuyển và trải nghiệm từ các đối tác uy tín.
                        </p>
                        <p className="mb-0 text-secondary">
                            Nền tảng hướng tới trải nghiệm đặt dịch vụ minh bạch, nhanh gọn
                            và dễ theo dõi trên cả desktop lẫn mobile.
                        </p>
                    </Card.Body>
                </Card>

                <Row className="g-3 g-lg-4 mb-4 mb-lg-5">
                    <Col md={6} lg={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Nhà cung cấp đang hoạt động
                                </p>
                                <h3 className="mb-0 fw-bold">200+</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Dịch vụ đang hiển thị
                                </p>
                                <h3 className="mb-0 fw-bold">2,500+</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Lượt đặt hằng tháng
                                </p>
                                <h3 className="mb-0 fw-bold">18,000+</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} lg={3}>
                        <Card className="h-100 border-0 shadow-sm">
                            <Card.Body>
                                <p className="text-uppercase text-secondary small mb-2">
                                    Mức độ hài lòng
                                </p>
                                <h3 className="mb-0 fw-bold">4.8/5</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={7}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-white border-0 pt-4 px-4">
                                <h4 className="mb-1">Tổng quan hệ thống</h4>
                                <p className="text-secondary mb-0">
                                    Các phân hệ trọng tâm hiện có trên EzTrip.
                                </p>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4">
                                <ListGroup variant="flush">
                                    <ListGroup.Item className="px-0">
                                        <h6 className="mb-1">Cổng thông tin khách hàng</h6>
                                        <p className="text-secondary mb-0">
                                            Tìm kiếm, so sánh và đặt dịch vụ với quy trình
                                            thao tác gọn, dễ sử dụng.
                                        </p>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0">
                                        <h6 className="mb-1">Cổng thông tin nhà cung cấp</h6>
                                        <p className="text-secondary mb-0">
                                            Quản lý danh mục dịch vụ, yêu cầu đặt và tình
                                            trạng sẵn sàng chỉ trên một bảng điều khiển.
                                        </p>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0">
                                        <h6 className="mb-1">Giao dịch đáng tin cậy</h6>
                                        <p className="text-secondary mb-0">
                                            Theo dõi trạng thái đặt dịch vụ rõ ràng từ xác
                                            nhận đến hoàn tất.
                                        </p>
                                    </ListGroup.Item>
                                    <ListGroup.Item className="px-0 pb-0">
                                        <h6 className="mb-1">Vận hành thống nhất</h6>
                                        <p className="text-secondary mb-0">
                                            Dữ liệu chuẩn hóa giúp đánh giá nhanh chất lượng,
                                            mức giá và khả năng đáp ứng của dịch vụ.
                                        </p>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={5}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Header className="bg-white border-0 pt-4 px-4">
                                <h4 className="mb-1">Điểm nổi bật của EzTrip</h4>
                                <p className="text-secondary mb-0">
                                    Được thiết kế cho cả khách hàng và nhà cung cấp.
                                </p>
                            </Card.Header>
                            <Card.Body className="px-4 pb-4">
                                <Stack gap={3}>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">Thông tin minh bạch</h6>
                                            <p className="mb-0 text-secondary">
                                                Mô tả và chi tiết giá được trình bày nhất quán,
                                                hỗ trợ ra quyết định đặt dịch vụ dễ dàng hơn.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">Hành trình đặt nhanh</h6>
                                            <p className="mb-0 text-secondary">
                                                Từ tìm kiếm đến xác nhận đều được tối ưu, hạn
                                                chế tối đa thao tác dư thừa.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                    <Card className="bg-light border-0">
                                        <Card.Body>
                                            <h6 className="mb-1">Mở rộng bền vững</h6>
                                            <p className="mb-0 text-secondary">
                                                Mô hình nền tảng hỗ trợ tăng trưởng trên nhiều
                                                nhóm dịch vụ khác nhau.
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Stack>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </CustomerLayout>
    );
}

export default Home;