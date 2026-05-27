import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_accommodation_item.jpg";

function CardHistoryBookingItem({
	name_of_service = "Tên dịch vụ",
	type_of_service = "Loại dịch vụ",
	name_of_provider = "Nhà cung cấp",
	created_at = "",
	booking_day = "",
	payment_method = "",
	quantity = 1,
	total_amount = "0 VNĐ",
	status = "Pending",
	onChat,
	onPrimaryAction,
}) {
	const isPending = status === "Pending";
	const isConfirmed = status === "Confirmed";
	const isCompleted = status === "Completed";

	const statusClass = isPending
		? "warning"
		: isConfirmed
		? "primary"
		: isCompleted
		? "success"
		: "secondary";

	const primaryLabel =
		isPending
			? "Hủy"
			: isConfirmed
			? "Chi tiết"
			: isCompleted
			? "Đánh giá"
			: "Xem";
	const primaryVariant = isPending ? "danger" : isCompleted ? "success" : "primary";

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
                                alt="Service"
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
                        md={4}
                        className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column gap-2">
                            <h2 className="mb-0 fw-semibold fs-4 text-truncate">
                                {name_of_service}
                            </h2>
                            <div className="text-secondary">
                                {type_of_service}
                            </div>
                            <div className="text-secondary">
                                {name_of_provider}
                            </div>
                        </div>

                        <div className="mt-3 d-flex justify-content-start">
                            <Button
                                variant="outline-secondary"
                                onClick={onChat}
                            >
                                Chat ngay
                            </Button>
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={3}
                        className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column gap-2">
                            <div>Ngày đặt: {created_at}</div>
                            <div>Ngày sử dụng: {booking_day}</div>
                            <div>Số lượng: {quantity}</div>
                            <div>Phương thức thanh toán: {payment_method}</div>
                        </div>

                        <div className="mt-3 fs-4 fw-semibold text-nowrap">
                            {total_amount}
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={2}
                        className="p-3 p-md-4 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column align-items-md-end align-items-start gap-3">
                            <Badge
                                bg={statusClass}
                                className="px-3 py-2 rounded-2 fs-6 text-uppercase align-self-md-end"
                            >
                                {status}
                            </Badge>

                            <Button
                                variant={primaryVariant}
                                onClick={onPrimaryAction}
                                className="w-100"
                            >
                                {primaryLabel}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default CardHistoryBookingItem;

