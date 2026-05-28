import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_transportation_item.jpg";
import { formatCurrency, formatHour } from "@utils/formatters";

function CardTransportationItem(props) {
    const {
        price,
        image,
        quantity,
        remainingQuantity,
        avgRating,
        reviewCount,
        bookingCount,
        companyName,
    } = props.baseInfo;
    const {
        typeOfTransportation,
        departureLocation,
        arrivalLocation,
        departureTime,
        arrivalTime,
    } = props;
    const { onSelect } = props;

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
                                alt={departureLocation}
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
                                        {departureLocation} - {arrivalLocation}
                                    </h5>
                                    <div className="d-flex flex-wrap gap-1 mt-1">
                                        <Badge bg="primary" text="light" className="rounded-0">
                                            Khởi hành: {formatHour(departureTime)}
                                        </Badge>
                                        <Badge bg="primary" text="light" className="rounded-0">
                                            Đến nơi: {formatHour(arrivalTime)}
                                        </Badge>
                                    </div>
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

                            <div className="text-muted">
                                Loại phương tiện: {typeOfTransportation}
                            </div>

                            <div className="d-flex flex-column gap-2 pt-2 border-top border-dark-subtle">
                                <div className="small text-muted">
                                    📝 {reviewCount} nhận xét
                                </div>
                                <div className="small text-muted">
                                    📅 {bookingCount} lượt đặt
                                </div>
                                <div className="small text-muted">
                                    ⏳ {remainingQuantity}/{quantity} chỗ còn trống
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
                                className="rounded-0 w-100"
                                onClick={onSelect}
                            >
                                Đặt vé
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardTransportationItem;
