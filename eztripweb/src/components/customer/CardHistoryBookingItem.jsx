import { useState } from "react";
import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_accommodation_item.jpg";
import { formatCurrency, formatDateTime } from "@utils/formatters";
import ModalReview from "@components/customer/ModalReview";
import ModalChat from "@components/common/ModalChat";
import { useAuth } from "@hooks/useAuth";
import { updateBooking } from "@services/customerService";

const SERVICE_TYPE_LABELS = {
	1: "Tour",
	2: "Lưu trú",
	3: "Vận chuyển",
};

const STATUS_META = {
	1: { key: "PENDING", label: "Đang chờ", badge: "warning" },
	2: { key: "CONFIRMED", label: "Đã xác nhận", badge: "primary" },
	3: { key: "COMPLETED", label: "Hoàn thành", badge: "success" },
	4: { key: "CANCELLED", label: "Đã hủy", badge: "secondary" },
	PENDING: { key: "PENDING", label: "Đang chờ", badge: "warning" },
	CONFIRMED: { key: "CONFIRMED", label: "Đã xác nhận", badge: "primary" },
	COMPLETED: { key: "COMPLETED", label: "Hoàn thành", badge: "success" },
	CANCELLED: { key: "CANCELLED", label: "Đã hủy", badge: "secondary" },
};

const PAYMENT_METHOD_LABELS = {
	1: "Tiền mặt",
	2: "Momo",
	3: "Chuyển khoản",
	CASH: "Tiền mặt",
	MOMO: "Momo",
	BANK_TRANSFER: "Chuyển khoản",
};

const STATUS_TRANSITIONS = {
	PENDING: [
		{ value: "CONFIRMED", label: "Xác nhận" },
		{ value: "CANCELLED", label: "Hủy" },
	],
	CONFIRMED: [{ value: "COMPLETED", label: "Hoàn thành" }],
};

function resolveStatusMeta(status) {
	return STATUS_META[status] || STATUS_META[String(status).toUpperCase()] || {
		key: String(status || ""),
		label: status || "Trạng thái",
		badge: "secondary",
	};
}

function resolveServiceTypeLabel(serviceType) {
	return SERVICE_TYPE_LABELS[serviceType] || SERVICE_TYPE_LABELS[String(serviceType)] || serviceType || "Loại dịch vụ";
}

function resolvePaymentMethodLabel(paymentMethod) {
	return PAYMENT_METHOD_LABELS[paymentMethod] || PAYMENT_METHOD_LABELS[String(paymentMethod).toUpperCase()] || paymentMethod || "-";
}

function CardHistoryBookingItem(props) {
	const { currentUser } = useAuth();
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showChatModal, setShowChatModal] = useState(false);
	const [savingStatus, setSavingStatus] = useState(false);
	const [actionError, setActionError] = useState("");
	const {
		id,
		serviceName,
		serviceType,
		serviceImage,
		createdDate,
		bookingDay,
		quantity,
		totalAmount,
		note,
		status,
		customerId,
		customerName,
		customerPhone,
		customerAvatar,
		companyId,
		companyName,
		paymentMethod,
		review,
	} = props;

	const normalizedReview = review ?? null;
	const statusMeta = resolveStatusMeta(status);
	const formattedAmount = Number.isFinite(Number(totalAmount))
		? formatCurrency(Number(totalAmount))
		: totalAmount;
	const serviceTypeLabel = resolveServiceTypeLabel(serviceType);
	const paymentMethodLabel = resolvePaymentMethodLabel(paymentMethod);
	const createdDateLabel = formatDateTime(createdDate) || createdDate || "-";
	const bookingDayLabel = formatDateTime(bookingDay) || bookingDay || "-";
	const isProviderViewing = Boolean(currentUser?.id && String(currentUser.id) === String(companyId));
	const canChat = Boolean(currentUser?.id && (isProviderViewing ? customerId : companyId));

	const handleCancelBooking = async () => {
		setSavingStatus(true);
		setActionError("");

		try {
			await updateBooking(id, { status: "CANCELLED" });
			props.onUpdated?.();
		} catch (error) {
			setActionError(error?.response?.data?.error || "Không thể hủy booking.");
		} finally {
			setSavingStatus(false);
		}
	};

	const handlePrimaryClick = () => {
		if (statusMeta.key === "PENDING") {
			void handleCancelBooking();
			return;
		}

		if (statusMeta.key === "COMPLETED") {
			setShowReviewModal(true);
		}
	};

	const primaryVisible = statusMeta.key === "PENDING" || statusMeta.key === "COMPLETED";
	const primaryLabel = statusMeta.key === "PENDING"
		? "Hủy"
		: normalizedReview
			? "Xem đánh giá"
			: "Đánh giá";
	const primaryVariant = statusMeta.key === "PENDING" ? "danger" : "success";

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
								src={serviceImage || defaultImage}
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
							<h5 className="mb-0 fw-semibold text-truncate">{serviceName}</h5>
							<div className="d-flex flex-wrap gap-2 align-items-center">
								<Badge bg="dark" className="rounded-0">{serviceTypeLabel}</Badge>
								<span className="text-secondary text-truncate">{companyName || "Nhà cung cấp"}</span>
							</div>
							{note ? <div className="text-secondary small text-truncate">{note}</div> : null}
						</div>

						<div className="mt-3 d-flex justify-content-start">
							<Button variant="outline-secondary" onClick={() => setShowChatModal(true)} disabled={!canChat}>
								Chat ngay
							</Button>
						</div>
						{actionError ? <div className="mt-2 small text-danger">{actionError}</div> : null}
					</Col>

					<Col
						xs={12}
						md={3}
						className="border-end border-dark-subtle p-2 p-md-3 d-flex flex-column justify-content-between"
					>
						<div className="d-flex flex-column gap-1 small">
							<div>Ngày đặt: {createdDateLabel}</div>
							<div>Ngày sử dụng: {bookingDayLabel}</div>
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
								bg={statusMeta.badge}
								className="px-3 py-2 rounded-0 fs-6 text-uppercase align-self-md-end"
							>
								{statusMeta.label}
							</Badge>

							{primaryVisible ? (
								<Button
									variant={primaryVariant}
									onClick={handlePrimaryClick}
									className="w-100 rounded-0"
									disabled={savingStatus}
								>
									{savingStatus ? "Đang xử lý" : primaryLabel}
								</Button>
							) : null}
						</div>
					</Col>
				</Row>
			</Card.Body>
			<ModalChat
				show={showChatModal}
				onHide={() => setShowChatModal(false)}
				currentUserId={currentUser?.id || ""}
				partnerUserId={isProviderViewing ? (customerId || "") : (companyId || "")}
				currentName={currentUser?.name || currentUser?.fullname || "Tôi"}
				partnerName={isProviderViewing ? (customerName || "Khách hàng") : (companyName || "Nhà cung cấp")}
				currentAvatar={currentUser?.avatar || ""}
				partnerAvatar={isProviderViewing ? (customerAvatar || "") : (props.companyAvatar || "")}
			/>
			<ModalReview
				show={showReviewModal}
				onHide={() => setShowReviewModal(false)}
				bookingId={id}
				serviceName={serviceName}
				review={normalizedReview}
				onSaved={props.onReviewSaved}
			/>
		</Card>
	);
}

export default CardHistoryBookingItem;

