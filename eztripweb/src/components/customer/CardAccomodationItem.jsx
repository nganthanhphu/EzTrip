import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_accommodation_item.jpg";

function CardAccommodationItem({
	name = "Phòng VIP",
	providerName = "Khách sạn Hoa Hồng",
	location = "Phường Văn Xá, TP.HCM",
    quantity_of_bed = 2,
    area = 15,
	rating = 9.5,
	price = "300.000 VNĐ",
	onSelect,
}) {
	return (
        <Card className="border-dark-subtle rounded-0">
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
                                alt="Accommodation"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                            <div className="fs-6 mb-3">{providerName}</div>
                            <div className="mb-2">📍 {location}</div>
                            <div className="d-flex flex-wrap gap-3">
                                <span>{quantity_of_bed} giường</span>
                                <span>{area} m²</span>
                            </div>

                            <div className="d-flex justify-content-md-end justify-content-start mb-3">
                                <Badge
                                    className="success"
                                >
                                    {rating} / 10
                                </Badge>
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
                            <Button
                                variant="primary"
                                onClick={onSelect}
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
