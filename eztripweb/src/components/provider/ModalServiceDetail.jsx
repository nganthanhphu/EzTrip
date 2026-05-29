import { Badge, Button, Col, Modal, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_tour_item.jpg";
import { formatCurrency } from "@utils/formatters";

function ModalServiceDetail({ show, onHide, service }) {
    const baseInfo = service?.baseInfo || service || {};
    const serviceTypeLabel = service?.serviceTypeName || service?.type_of_service_name || "Dịch vụ";

    return (
        <Modal show={show} onHide={onHide} centered size="lg" scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết dịch vụ</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                <Row className="g-4 align-items-start">
                    <Col xs={12} md={5}>
                        <div className="rounded-3 overflow-hidden border border-dark-subtle bg-light">
                            <img
                                src={baseInfo.image || defaultImage}
                                alt={baseInfo.name || "Dịch vụ"}
                                className="w-100"
                                style={{ objectFit: "cover", minHeight: 240 }}
                            />
                        </div>
                    </Col>

                    <Col xs={12} md={7}>
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex flex-wrap align-items-center gap-2">
                                <h4 className="mb-0 fw-semibold">{baseInfo.name || "Dịch vụ"}</h4>
                                <Badge bg="warning" text="dark" className="rounded-0">
                                    {serviceTypeLabel}
                                </Badge>
                            </div>

                            <div className="text-body-secondary">{baseInfo.companyName || "Chưa có tên nhà cung cấp"}</div>

                            <div className="rounded-3 bg-light p-3 d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Giá</span>
                                    <span className="fw-semibold text-end">
                                        {formatCurrency(Number(baseInfo.price || 0))}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Số lượng</span>
                                    <span className="fw-semibold text-end">{baseInfo.quantity ?? 0}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Còn lại</span>
                                    <span className="fw-semibold text-end">{baseInfo.remainingQuantity ?? 0}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Đánh giá trung bình</span>
                                    <span className="fw-semibold text-end">
                                        {baseInfo.avgRating != null ? `${Number(baseInfo.avgRating).toFixed(1)} / 10` : "Chưa có"}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Số đánh giá</span>
                                    <span className="fw-semibold text-end">{baseInfo.reviewCount ?? 0}</span>
                                </div>
                                <div className="d-flex justify-content-between gap-3">
                                    <span className="text-body-secondary">Số booking</span>
                                    <span className="fw-semibold text-end">{baseInfo.bookingCount ?? 0}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalServiceDetail;