import {
    Badge,
    Card,
    Col,
    Container,
    Row,
    Stack,
} from "react-bootstrap";
import ProviderLayout from "@layouts/ProviderLayout";

function Home() {
    return (
        <ProviderLayout>
            {/* Hero Section - Phần chào mừng đối tác */}
            <div className="bg-light py-5 mb-5 border-bottom">
                <Container className="py-lg-5">
                    <Row className="justify-content-center text-center">
                        <Col lg={9}>
                            <Badge bg="success" pill className="px-3 py-2 mb-3 shadow-sm text-uppercase">
                                Không gian đối tác EzTrip
                            </Badge>
                            <h1 className="display-5 fw-bold mb-4 text-dark">
                                Quản lý dịch vụ thông minh, <br />
                                <span className="text-success">Vận hành hiệu quả hơn.</span>
                            </h1>
                            <p className="lead text-secondary px-md-5">
                                Chào mừng bạn đến với trung tâm kiểm soát toàn diện của EzTrip. 
                                Nền tảng được thiết kế chuyên biệt để giúp các nhà cung cấp dễ dàng theo dõi, 
                                tối ưu hóa nguồn lực và mang lại trải nghiệm hoàn hảo nhất cho khách hàng.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="mb-5 pb-lg-5">
                {/* Core Values - Giá trị cốt lõi mang lại cho Provider */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold mb-3">Trợ thủ đắc lực cho doanh nghiệp của bạn</h2>
                    <p className="text-secondary fs-5">Hệ thống công cụ tập trung, đơn giản hóa mọi quy trình phức tạp.</p>
                </div>

                <Row className="g-4 mb-5">
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">📊</div>
                                <h4 className="fw-bold mb-3">Quản lý tập trung</h4>
                                <p className="text-secondary mb-0">
                                    Kiểm soát toàn bộ danh mục từ phòng nghỉ, vé xe đến các tour du lịch chỉ trên một bảng điều khiển duy nhất, trực quan và liền mạch.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">💬</div>
                                <h4 className="fw-bold mb-3">Tương tác trực tiếp</h4>
                                <p className="text-secondary mb-0">
                                    Hệ thống tin nhắn tích hợp giúp bạn trao đổi tức thì với khách hàng, tư vấn dịch vụ và giải quyết vấn đề nhanh chóng.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="h-100 border-0 shadow-sm rounded-4 text-center">
                            <Card.Body className="p-4 p-lg-5">
                                <div className="display-4 mb-3">⚙️</div>
                                <h4 className="fw-bold mb-3">Tối ưu vận hành</h4>
                                <p className="text-secondary mb-0">
                                    Quy trình nhận và xác nhận đơn đặt được tự động hóa tối đa, giúp giảm thiểu sai sót thủ công và tiết kiệm thời gian.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Workflow/Onboarding - Lộ trình làm việc thay cho các con số cứng */}
                <Row className="justify-content-center mt-5">
                    <Col lg={10}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <Card.Header className="bg-success text-white border-0 pt-4 px-4 pb-3">
                                <h4 className="mb-1">Hành trình kiến tạo thành công</h4>
                                <p className="mb-0 text-white-50">
                                    Các bước cơ bản để khai thác tối đa tiềm năng kinh doanh trên nền tảng EzTrip.
                                </p>
                            </Card.Header>
                            <Card.Body className="p-4 p-lg-5 bg-white">
                                <Stack gap={4}>
                                    <div className="d-flex align-items-start">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: 48, height: 48 }}>
                                            <span className="fw-bold fs-5">1</span>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Xây dựng hồ sơ ấn tượng</h5>
                                            <p className="text-secondary mb-0">
                                                Cập nhật đầy đủ thông tin dịch vụ, định giá rõ ràng và đính kèm hình ảnh chất lượng cao để thu hút sự chú ý của khách hàng ngay từ cái nhìn đầu tiên.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: 48, height: 48 }}>
                                            <span className="fw-bold fs-5">2</span>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Sẵn sàng tiếp nhận yêu cầu</h5>
                                            <p className="text-secondary mb-0">
                                                Duy trì trạng thái hoạt động thường xuyên, kiểm tra hộp thư tin nhắn và xác nhận đơn đặt phòng/vé kịp thời để tăng độ uy tín cho thương hiệu.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start">
                                        <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: 48, height: 48 }}>
                                            <span className="fw-bold fs-5">3</span>
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-2">Lắng nghe và hoàn thiện</h5>
                                            <p className="text-secondary mb-0">
                                                Theo dõi các đánh giá sau chuyến đi của khách hàng. Việc phản hồi tích cực và cải thiện liên tục là chìa khóa để giữ chân khách hàng lâu dài.
                                            </p>
                                        </div>
                                    </div>
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