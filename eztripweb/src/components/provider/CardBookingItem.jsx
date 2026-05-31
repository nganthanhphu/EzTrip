import { useState } from "react";
import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "@assets/images/default_accommodation_item.jpg";
import { formatCurrency, formatDateTime } from "@utils/formatters";
import ModalChat from "@components/common/ModalChat";
import { useAuth } from "@hooks/useAuth";
import { updateBooking } from "@services/providerService";

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

function resolveStatusMeta(status) {
	return STATUS_META[status] || STATUS_META[String(status).toUpperCase()] || {
		key: String(status || ""),
		label: status || "Trạng thái",
		badge: "secondary",
	};
}

function resolvePaymentMethodLabel(paymentMethod) {
	return PAYMENT_METHOD_LABELS[paymentMethod] || PAYMENT_METHOD_LABELS[String(paymentMethod).toUpperCase()] || paymentMethod || "-";
}

function CardBookingItem(props) {
	const { currentUser } = useAuth();
	const [showChatModal, setShowChatModal] = useState(false);
	const [savingStatus, setSavingStatus] = useState(false);
	const [actionError, setActionError] = useState("");
	const {
		id,
		customerId,
		customerName,
		customerPhone,
		customerAvatar,
		createdDate,
		bookingDay,
		quantity,
		totalAmount,
		status,
		paymentMethod,
	} = props;

	const statusMeta = resolveStatusMeta(status);
	const createdDateLabel = formatDateTime(createdDate) || createdDate || "-";
	const bookingDayLabel = formatDateTime(bookingDay) || bookingDay || "-";
	const paymentMethodLabel = resolvePaymentMethodLabel(paymentMethod);
	const formattedAmount = Number.isFinite(Number(totalAmount))
		? formatCurrency(Number(totalAmount))
		: totalAmount || "-";

	const isPending = statusMeta.key === "PENDING";
	const isConfirmed = statusMeta.key === "CONFIRMED";
	const canChat = Boolean(currentUser?.id && customerId);

	const handleUpdateStatus = async (nextStatus) => {
		setSavingStatus(true);
		setActionError("");

		try {
			await updateBooking(id, { status: nextStatus });
			props.onUpdated?.();
		} catch (error) {
			setActionError(error?.response?.data?.error || "Không thể cập nhật trạng thái booking.");
		} finally {
			setSavingStatus(false);
		}
	};

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
                                src={customerAvatar || defaultImage}
                                alt={customerName}
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
                            <h5
                                className="mb-0 fw-semibold text-wrap"
                                style={{ wordBreak: "break-word" }}
                            >
                                {customerName}
                            </h5>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                                <Badge bg="dark" className="rounded-0">
                                    Khách hàng
                                </Badge>
							</div>
							<div className="small text-muted">📞 Số điện thoại: {customerPhone || "Không có số điện thoại"}</div>
                        </div>

                        <div className="mt-3 d-flex justify-content-start">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowChatModal(true)}
                                disabled={!canChat}
                            >
                                Chat ngay
                            </Button>
                        </div>
                        {actionError ? (
                            <div className="mt-2 small text-danger">
                                {actionError}
                            </div>
                        ) : null}
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
                            <div>
                                Phương thức thanh toán: {paymentMethodLabel}
                            </div>
                        </div>

                        <div className="mt-2 fs-5 fw-semibold text-nowrap">
                            {formattedAmount}
                        </div>
                    </Col>

                    <Col
                        xs={12}
                        md={2}
                        className="p-2 p-md-3 d-flex flex-column justify-content-between"
                    >
                        <div className="d-flex flex-column align-items-md-end align-items-start gap-2">
                            <Badge
                                bg={statusMeta.badge}
                                className="w-100 px-3 py-2 rounded-0 fs-6 text-uppercase text-center"
                            >
                                {statusMeta.label}
                            </Badge>

                            {isPending ? (
                                <Button
                                    variant="primary"
                                    onClick={() =>
                                        void handleUpdateStatus("CONFIRMED")
                                    }
                                    className="w-100 rounded-0"
                                    disabled={savingStatus}
                                >
                                    {savingStatus ? "Đang xử lý" : "Xác nhận"}
                                </Button>
                            ) : null}

                            {isConfirmed ? (
                                <Button
                                    variant="success"
                                    onClick={() =>
                                        void handleUpdateStatus("COMPLETED")
                                    }
                                    className="w-100 rounded-0"
                                    disabled={savingStatus}
                                >
                                    {savingStatus ? "Đang xử lý" : "Hoàn thành"}
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
                partnerUserId={customerId || ""}
                currentName={
                    currentUser?.name || currentUser?.fullname || "Tôi"
                }
                partnerName={customerName || "Khách hàng"}
                currentAvatar={currentUser?.avatar || ""}
                partnerAvatar={customerAvatar || ""}
            />
        </Card>
    );
}

export default CardBookingItem;
