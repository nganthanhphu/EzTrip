import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import defaultImage from "@assets/images/default_tour_item.jpg";
import { formatCurrency } from "@utils/formatters";

function CardTourItem(props) {
    const { id, name, price, image, quantity, remainingQuantity, avgRating, reviewCount, bookingCount, companyName } = props.baseInfo;
    const { location, tourDuration } = props;
    const nav = useNavigate();

    return (
        <Card className="w-100 border border-dark-subtle rounded-0 shadow-none mb-3 overflow-hidden">
            <Card.Body className="p-0">
                <Row className="g-0 align-items-stretch">
                    <Col
                        xs={12}
                        md={4}
                        className="border-end border-dark-subtle bg-light d-flex align-items-stretch"
                    >
                        <div className="w-100" style={{ minHeight: 170 }}>
                            <Image
                                src={image || defaultImage}
                                alt={name}
                                className="w-100 h-100"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={5}
                        className="border-end border-dark-subtle p-2 p-md-3 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column gap-1">
                            <div className="d-flex align-items-start justify-content-between gap-2">
                                <div className="min-w-0">
                                    <h5 className="mb-1 fw-bold text-truncate">{name}</h5>
                                    <div className="text-muted small text-truncate">{companyName}</div>
                                </div>

                                <Badge bg="warning" text="dark" className="rounded-0 align-self-start">
                                    {Number(avgRating || 0).toFixed(1)} / 10
                                </Badge>
                            </div>

                            <div className="text-muted">📍 {location}</div>

                            <div className="d-flex flex-column gap-2 pt-2 border-top border-dark-subtle">
                                <div className="small text-muted">🧭 <b>Thời lượng tour:</b> {tourDuration} ngày</div>
                                <div className="small text-muted">📝 <b>Tổng số đánh giá:</b> {reviewCount}</div>
                                <div className="small text-muted">📅 <b>Số lượt đặt:</b> {bookingCount}</div>
                                <div className="small text-muted">⏳ <b>Chỗ còn lại:</b> {remainingQuantity}/{quantity} chỗ</div>
                            </div>
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={3}
                        className="p-2 p-md-3 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column align-items-md-end align-items-start gap-2">
                            <div className="fs-5 fw-semibold text-nowrap text-primary">
                                {formatCurrency(Number(price || 0))}
                            </div>

                            <Button variant="primary" size="sm" onClick={() => nav(`/tours/${id}`)} className="rounded-0 w-100">
                                Xem chi tiết
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardTourItem;
