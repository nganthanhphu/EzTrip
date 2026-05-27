import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_accommodation_item.jpg";

function CardBookingItem({
	customer_name = "Khach hang",
	customer_phone = "0123 456 789",
	customer_email = "customer@email.com",
	customer_dob = "01/01/2000",
	customer_gender = "Nam",
	customer_avatar = defaultImage,
	created_date = "25/05/2026",
	booking_day = "26/05/2026",
	payment_method = "Momo",
	quantity = 1,
	total_amount = "150.000 VNĐ",
	status = "Pending",
	onChat,
	onConfirm,
	onCancel,
	onComplete,
}) {
	const isPending = status === "Pending";
	const isConfirmed = status === "Confirmed";
	const isCompleted = status === "Completed";

	const statusVariant = isPending
		? "warning"
		: isConfirmed
		? "primary"
		: isCompleted
		? "success"
		: "secondary";

	const statusLabel = isPending
		? "Pending"
		: isConfirmed
		? "Confirmed"
		: isCompleted
		? "Completed"
		: status;

	return (
		<Card className="w-100 border-dark-subtle rounded-0">
			<Card.Body className="p-0">
				<Row className="g-0 align-items-stretch">
					<Col
						xs={12}
						md={2}
						className="border-end border-dark-subtle d-flex align-items-stretch bg-light p-0"
					>
						<div className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
							<Image
								src={customer_avatar || defaultImage}
								alt={customer_name}
								roundedCircle
								style={{ width: 110, height: 110, objectFit: "cover" }}
							/>
						</div>
					</Col>

					<Col
						xs={12}
						md={4}
						className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column gap-2">
							<div className="d-flex align-items-center gap-2 flex-wrap">
								<h2 className="mb-0 fw-semibold fs-4 text-truncate">
									{customer_name}
								</h2>
								<Badge bg="secondary" className="text-uppercase">
									{customer_gender}
								</Badge>
							</div>
							<div className="text-secondary">{customer_phone}</div>
							<div className="text-secondary text-break">{customer_email}</div>
							<div className="text-secondary">{customer_dob}</div>
						</div>

						<div className="mt-3 d-flex justify-content-start">
							<Button variant="outline-secondary" onClick={onChat}>
								Chat ngay
							</Button>
						</div>
					</Col>

					<Col
						xs={12}
						md={4}
						className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column gap-2">
							<div>Ngày xuất hóa đơn: {created_date}</div>
							<div>Ngày sử dụng dịch vụ: {booking_day}</div>
							<div>Phương thức thanh toán: {payment_method}</div>
							<div>Số lượng đặt: {quantity}</div>
						</div>

						<div className="mt-3 fs-4 fw-semibold text-nowrap">{total_amount}</div>
					</Col>

					<Col
						xs={12}
						md={2}
						className="p-3 p-md-4 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column align-items-md-end align-items-start gap-3">
							<Badge
								bg={statusVariant}
								className="px-3 py-2 rounded-2 fs-6 text-uppercase align-self-md-end"
							>
								{statusLabel}
							</Badge>

							{isPending && (
								<div className="d-flex gap-2 w-100 justify-content-md-end">
									<Button variant="primary" onClick={onConfirm} className="flex-fill flex-md-grow-0">
										Confirm
									</Button>
									<Button variant="danger" onClick={onCancel} className="flex-fill flex-md-grow-0">
										Cancel
									</Button>
								</div>
							)}

							{isConfirmed && (
								<Button variant="success" onClick={onComplete} className="w-100">
									Complete
								</Button>
							)}

							{!isPending && !isConfirmed && !isCompleted && (
								<Button variant="secondary" className="w-100" disabled>
									No action
								</Button>
							)}
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default CardBookingItem;
