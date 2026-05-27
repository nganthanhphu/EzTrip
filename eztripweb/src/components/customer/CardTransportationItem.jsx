import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_transportation_item.jpg";

function CardTransportationItem({
	imageUrl = defaultImage,
    name = "Tên hành trình",
    providerName = "Xe khách Phương Trang",
	type_of_transportation = "Loại phương tiện",
	departure_location = "Điểm đi",
	arrival_location = "Điểm đến",
	departure_time = "--:--",
	arrival_time = "--:--",
	avaibility_count = 0,
	price = "0 VNĐ",
	rating = 0,
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
                                alt="Transportation"
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
                            <h2 className="mb-2 fw-semibold">
                                {departure_location} → {arrival_location}
                            </h2>
                            <div className="fs-6 mb-2">
                                {" "}
                                Loại phương tiện: {type_of_transportation}
                            </div>
                            <div className="fs-6 mb-3">{providerName}</div>
                            <div className="d-flex flex-wrap gap-3">
                                <span>{departure_time}</span>
                                <span>{arrival_time}</span>
                            </div>
                            <div>Số ghế còn lại: {avaibility_count}</div>

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
