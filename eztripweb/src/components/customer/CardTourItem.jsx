import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_tour_item.jpg";

function CardTourItem({
    name = "Tour mẫu",
    providerName = "Nhà cung cấp",
    location = "Địa điểm",
    price = "0 VNĐ",
    rating = 0,
    avaibility_count = 0,
    tour_duration = "1 ngày",
    onSelect,
}) {
    return (
        <Card className="w-100 border-dark-subtle rounded-0">
            <Card.Body className="p-0">
                <Row className="g-0 align-items-stretch">
                    <Col
                        xs={12}
                        md={3}
                        className="border-end border-dark-subtle d-flex align-items-stretch bg-light p-0"
                    >
                        <div className="w-100 h-100">
                            <Image
                                src={defaultImage}
                                alt="Tour"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={6}
                        className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
                    >
                        <div>
                            <h2 className="mb-2 fw-semibold">{name}</h2>
                            <div className="fs-6 mb-2">{providerName}</div>
                            <div className="mb-2">📍 {location}</div>

                            <div className="d-flex flex-wrap gap-3 mb-2">
                                <span>Thời lượng: {tour_duration}</span>
                                <span>{avaibility_count} chỗ</span>
                            </div>

                            <div className="d-flex justify-content-md-end justify-content-start mb-3">
                                <Badge className="success">{rating} / 10</Badge>
                            </div>
                        </div>
                    </Col>
                    <Col
                        xs={12}
                        md={3}
                        className="p-3 p-md-4 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column align-items-md-end align-items-start gap-3">
                            <div className="fs-3 fw-semibold text-nowrap">
                                {price}
                            </div>
                            <Button variant="primary" onClick={onSelect}>
                                Đặt tour
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardTourItem;
