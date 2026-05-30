import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { createBooking } from "@services/customerService";
import { formatBookingDate, formatCurrency } from "@utils/formatters";
import { openMomoPaymentForBooking } from "@utils/onlinePayment";

const PAYMENT_METHODS = [
	{ id: 1, label: "Tiền mặt" },
	{ id: 2, label: "MOMO" },
	{ id: 3, label: "Chuyển khoản" },
];

function getDateInputValue(offsetDays = 0) {
	const date = new Date();
	date.setDate(date.getDate() + offsetDays);
	return date.toISOString().split("T")[0];
}



function ModalConfirmAccommodationBooking({ show, onHide, accommodation }) {
	const [checkInDate, setCheckInDate] = useState(getDateInputValue(1));
	const [checkOutDate, setCheckOutDate] = useState(getDateInputValue(2));
	const [quantity, setQuantity] = useState(1);
	const [paymentMethodId, setPaymentMethodId] = useState(3);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState("");

	useEffect(() => {
		if (!show) {
			return;
		}

		setCheckInDate(getDateInputValue(1));
		setCheckOutDate(getDateInputValue(2));
		setQuantity(1);
		setPaymentMethodId(3);
		setSubmitError("");
		setSubmitSuccess("");
	}, [show]);

	const totalAmount = (accommodation?.baseInfo?.price ?? 0) * quantity;
	const bookingDay = formatBookingDate(checkInDate);
	const bookingNote = `${formatBookingDate(checkInDate)} - ${formatBookingDate(checkOutDate)}`;

	async function handleSubmit(event) {
		event.preventDefault();

		if (!accommodation?.baseInfo?.id) {
			setSubmitError("Không tìm thấy dịch vụ để đặt phòng.");
			return;
		}

		if (!checkInDate || !checkOutDate || checkInDate >= checkOutDate) {
			setSubmitError("Ngày trả phòng phải sau ngày nhận phòng.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError("");
		setSubmitSuccess("");

		try {
			await createBooking({
				serviceId: accommodation.baseInfo.id,
				paymentMethodId,
				bookingDay,
				quantity,
				note: bookingNote,
			});

			if (paymentMethodId === 2) {
				await openMomoPaymentForBooking({
					serviceName: accommodation?.baseInfo?.name,
					bookingDay,
					quantity,
					note: bookingNote,
					paymentMethodId,
				});
				return;
			}

			setSubmitSuccess("Đặt phòng thành công. Hệ thống đã ghi nhận yêu cầu của bạn.");
			setTimeout(() => onHide?.(), 5000);
		} catch (error) {
			setSubmitError(error?.response?.data?.message || "Không thể tạo booking, vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Modal show={show} onHide={onHide} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Chi tiết đặt phòng</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body className="p-4">
					<div className="mb-4">
						<h5 className="fw-semibold mb-1">{accommodation?.baseInfo?.name}</h5>
						<div className="text-body-secondary">{accommodation?.location}</div>
					</div>

					{submitSuccess ? <div className="alert alert-success py-2">{submitSuccess}</div> : null}
					{submitError ? <div className="alert alert-danger py-2">{submitError}</div> : null}

					<Row className="g-3">
						<Col xs={12} md={6}>
							<Form.Label>Chọn ngày nhận phòng</Form.Label>
							<Form.Control
								type="date"
								value={checkInDate}
								onChange={(event) => setCheckInDate(event.target.value)}
							/>
						</Col>

						<Col xs={12} md={6}>
							<Form.Label>Chọn ngày trả phòng</Form.Label>
							<Form.Control
								type="date"
								value={checkOutDate}
								onChange={(event) => setCheckOutDate(event.target.value)}
							/>
						</Col>

						<Col xs={12} md={6}>
							<Form.Label>Số lượng phòng</Form.Label>
							<Form.Control
								type="number"
								min="1"
								value={quantity}
								onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
							/>
						</Col>

						<Col xs={12} md={6}>
							<Form.Label>Phương thức thanh toán</Form.Label>
							<Form.Select
								value={paymentMethodId}
								onChange={(event) => setPaymentMethodId(Number(event.target.value))}
							>
								{PAYMENT_METHODS.map((method) => (
									<option key={method.id} value={method.id}>
										{method.label}
									</option>
								))}
							</Form.Select>
						</Col>

						<Col xs={12}>
							<div className="rounded-3 bg-light p-3 d-flex flex-wrap gap-3 justify-content-between align-items-center">
								<div>
									<div className="text-body-secondary small">Đơn giá</div>
									<div className="fw-semibold">{formatCurrency(accommodation?.baseInfo?.price ?? 0)}</div>
								</div>
								<div>
									<div className="text-body-secondary small">Tổng tiền</div>
									<div className="fw-bold text-success">{formatCurrency(totalAmount)}</div>
								</div>
								<div>
									<div className="text-body-secondary small">Ghi chú</div>
									<div className="fw-semibold">{bookingNote}</div>
								</div>
							</div>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={onHide} disabled={isSubmitting}>
						Hủy
					</Button>
					<Button type="submit" variant="primary" disabled={isSubmitting}>
						{isSubmitting ? "Đang xử lý..." : "Xác nhận đặt phòng"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default ModalConfirmAccommodationBooking;
