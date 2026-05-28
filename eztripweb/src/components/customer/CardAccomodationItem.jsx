import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_accommodation_item.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import formatCurrency from "@utils/formatters";

function CardAccommodationItem(props) {
    const { id, name, price, image, quantity, remainingQuantity, avgRating, reviewCount, bookingCount, companyName } = props.baseInfo;
    const location = props.location;
    const quantityOfBed = props.quantityOfBed;
    const area = props.area;
    const nav = useNavigate();

    return (
        <Card className="shadow-sm rounded-3 mb-3" onClick={() => nav(`/accommodation/${id}`)} style={{ cursor: "pointer" }}>
            <Card.Body className="p-0">
                <Row className="g-0 align-items-stretch">
                    <Col xs={12} md={4} className="p-0 d-flex align-items-center justify-content-center">
                        <div className="bg-light overflow-hidden d-flex align-items-center justify-content-center" style={{ width: "100%", height: "100%" }}>
                            <Image
                                src={image || defaultImage}
                                alt={name}
                                style={{objectFit: "cover" }}
                            />
                        </div>
                    </Col>

                    <Col xs={12} md={5} className="p-3 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-start justify-content-between mb-2">
                                <div>
                                    <h5 className="mb-1 fw-bold">{name}</h5>
                                    <div className="text-muted small">{companyName}</div>
                                </div>

                                <div className="text-end">
                                    <Badge bg="warning" text="dark" className="rounded-1 shadow-sm">{avgRating} / 10</Badge>
                                </div>
                            </div>

                            <div className="mb-2 text-muted">📍 {location}</div>

                            <div className="d-flex flex-wrap gap-3 mb-3">
                                <div className="small text-muted">🛏️ {quantityOfBed} giường</div>
                                <div className="small text-muted">📐 {area} m²</div>
                                <div className="small text-muted">📝 {reviewCount} nhận xét</div>
                                <div className="small text-muted">📅 {bookingCount} lượt đặt</div>
                                <div className="small text-muted">⏳ {remainingQuantity}/{quantity} phòng còn trống</div>
                            </div>
                        </div>
                    </Col>

                    <Col xs={12} md={3} className="p-3 d-flex flex-column justify-content-between">
                        <div className="d-flex flex-column align-items-md-end align-items-start gap-3">
                            <div className="fs-4 fw-semibold text-nowrap text-primary">{formatCurrency(price)}</div>
                            <div className="d-flex gap-2">
                                <Button variant="primary" size="sm" as={Link} to={`/accommodations/${id}?action=book`} className="rounded-1">
                                    Chọn phòng
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardAccommodationItem;
