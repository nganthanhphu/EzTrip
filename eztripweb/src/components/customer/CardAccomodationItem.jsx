import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_accommodation_item.jpg";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@utils/formatters";

function CardAccommodationItem(props) {
    const { id, name, price, image, quantity, remainingQuantity, avgRating, reviewCount, bookingCount, companyName } = props.baseInfo;
    const { location, quantityOfBed, area } = props;
    const nav = useNavigate();

    return (
        <Card className="w-100 border border-dark-subtle rounded-0 shadow-none overflow-hidden mb-3">
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
                                    <h5 className="mb-1 fw-bold text-truncate">
                                        {name}
                                    </h5>
                                    <div className="text-muted small text-truncate">
                                        {companyName}
                                    </div>
                                </div>

                                <Badge
                                    bg="warning"
                                    text="dark"
                                    className="rounded-0 align-self-start"
                                >
                                    {avgRating} / 10
                                </Badge>
                            </div>

                            <div className="text-muted">📍 {location}</div>

                            <div className="d-flex flex-column gap-2 pt-2 border-top border-dark-subtle">
                                <div className="small text-muted">
                                    🛏️ {quantityOfBed} giường
                                </div>
                                <div className="small text-muted">
                                    📐 {area} m²
                                </div>
                                <div className="small text-muted">
                                    📝 {reviewCount} nhận xét
                                </div>
                                <div className="small text-muted">
                                    📅 {bookingCount} lượt đặt
                                </div>
                                <div className="small text-muted">
                                    ⏳ {remainingQuantity}/{quantity} phòng còn
                                    trống
                                </div>
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
                                {formatCurrency(price)}
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => nav(`/accommodation/${id}`)}
                                className="rounded-0 w-100"
                            >
                                Chọn phòng
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardAccommodationItem;
