import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_tour_item.jpg";
import { formatCurrency } from "@utils/formatters";
import { useNavigate } from "react-router-dom";

function CardServiceItem(props) {
    const baseInfo = props.baseInfo || {};
    const { id, name, price, image, quantity, remainingQuantity, avgRating, reviewCount, bookingCount, companyName } = baseInfo;
    const nav = useNavigate();
    const handleEdit = props.onEdit;

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
                                    <h5
                                        className="mb-1 fw-bold text-wrap"
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {name}
                                    </h5>
                                    <div className="text-muted small text-truncate">
                                        {companyName || ""}
                                    </div>
                                </div>

                                <Badge
                                    bg="warning"
                                    text="dark"
                                    className="rounded-0 align-self-start"
                                >
                                    {avgRating != null
                                        ? `${Number(avgRating).toFixed(1)} / 10`
                                        : "Chưa có đánh giá"}
                                </Badge>
                            </div>

                            <div className="d-flex flex-column gap-2 pt-2 border-top border-dark-subtle">
                                <div className="small text-muted">
                                    📝 <b>Tổng số đánh giá:</b>{" "}
                                    {reviewCount ?? 0}
                                </div>
                                <div className="small text-muted">
                                    📅 <b>Số lượt đặt:</b> {bookingCount ?? 0}
                                </div>
                                <div className="small text-muted">
                                    ⏳ <b>Số lượng còn lại:</b>{" "}
                                    {remainingQuantity ?? 0} / {quantity ?? 0}
                                </div>
                                <div className="fs-5 fw-semibold text-nowrap text-primary">
                                    {formatCurrency(price)}
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
                            <Button
                                variant="outline-primary"
                                className="rounded-0 w-100"
                                onClick={handleEdit}
                            >
                                Chỉnh sửa
                            </Button>
                            <Button
                                variant="primary"
                                className="rounded-0 w-100"
                                onClick={() =>
                                    nav(`/provider/services/${id}/bookings`)
                                }
                            >
                                Danh sách booking
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardServiceItem;
