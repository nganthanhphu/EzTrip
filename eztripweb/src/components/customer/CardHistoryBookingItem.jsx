import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_accommodation_item.jpg";
import { formatCurrency } from "@utils/formatters";

const SERVICE_TYPE_LABELS = {
	1: "Tour",
	2: "Lưu trú",
	3: "Vận chuyển",
};

const STATUS_LABELS = {
	PENDING: "Đang chờ",
	CONFIRMED: "Đã xác nhận",
	COMPLETED: "Hoàn thành",
	CANCELLED: "Đã hủy",
};

const PAYMENT_METHOD_LABELS = {
	CASH: "Tiền mặt",
	MOMO: "Momo",
	BANK_TRANSFER: "Chuyển khoản",
};

function CardHistoryBookingItem(props) {
	const serviceName = props.serviceName ?? props.name_of_service ?? "Tên dịch vụ";
	const serviceType = props.serviceType ?? props.type_of_service ?? "";
	const serviceImage = props.serviceImage ?? props.service_image ?? defaultImage;
	const providerName =
		props.providerName ?? props.name_of_provider ?? props.note ?? props.customerName ?? "";
	const createdDate = props.createdDate ?? props.created_at ?? "";
	const bookingDay = props.bookingDay ?? props.booking_day ?? "";
	const paymentMethod = props.paymentMethod ?? props.payment_method ?? "";
	const quantity = props.quantity ?? 1;
	const totalAmount = props.totalAmount ?? props.total_amount ?? 0;
	const status = String(props.status ?? "PENDING").toUpperCase();
	const onChat = props.onChat;
	const onPrimaryAction = props.onPrimaryAction;

	const isPending = status === "PENDING";
	const isConfirmed = status === "CONFIRMED";
	const isCompleted = status === "COMPLETED";

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
	const serviceTypeLabel = SERVICE_TYPE_LABELS[serviceType] || serviceType || "Loại dịch vụ";
	const statusLabel = STATUS_LABELS[status] || status;
	const paymentMethodLabel = PAYMENT_METHOD_LABELS[String(paymentMethod).toUpperCase()] || paymentMethod;
	const formattedAmount = Number.isFinite(Number(totalAmount))
		? formatCurrency(Number(totalAmount))
		: totalAmount;

	return (
		<Card className="w-100 border border-dark-subtle rounded-0 shadow-none overflow-hidden">
			<Card.Body className="p-0">
				<Row className="g-0 align-items-stretch">
					<Col
						xs={12}
						md={3}
						className="border-end border-dark-subtle bg-light d-flex align-items-stretch"
					>
						<div className="w-100" style={{ minHeight: 170 }}>
							<Image
								src={serviceImage}
								alt={serviceName}
								className="w-100 h-100"
								style={{ objectFit: "cover" }}
							/>
						</div>
					</Col>

					<Col
						xs={12}
						md={4}
						className="border-end border-dark-subtle p-2 p-md-3 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column gap-1">
							<h5 className="mb-0 fw-semibold text-truncate">
								{serviceName}
							</h5>
							<div className="text-secondary">{serviceTypeLabel}</div>
							{providerName ? <div className="text-secondary text-truncate">{providerName}</div> : null}
						</div>

						<div className="mt-3 d-flex justify-content-start">
							<Button variant="outline-secondary" onClick={onChat}>
								Chat ngay
							</Button>
						</div>
					</Col>

					<Col
						xs={12}
						md={3}
						className="border-end border-dark-subtle p-2 p-md-3 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column gap-1 small">
							<div>Ngày đặt: {createdDate}</div>
							<div>Ngày sử dụng: {bookingDay}</div>
							<div>Số lượng: {quantity}</div>
							<div>Phương thức thanh toán: {paymentMethodLabel}</div>
						</div>

						<div className="mt-2 fs-5 fw-semibold text-nowrap">{formattedAmount}</div>
					</Col>

					<Col
						xs={12}
						md={2}
						className="p-2 p-md-3 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column align-items-md-end align-items-start gap-2">
							<Badge
								bg={statusClass}
								className="px-3 py-2 rounded-0 fs-6 text-uppercase align-self-md-end"
							>
								{statusLabel}
							</Badge>

							<Button
								variant={primaryVariant}
								onClick={onPrimaryAction}
								className="w-100 rounded-0"
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

