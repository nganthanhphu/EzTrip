import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { formatCurrency, formatBookingDate} from "@utils/formatters";
import { createBooking } from "@services/customerService";
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

function ModalConfirmTransportationBooking({ show, onHide, transportation }) {
	const [departureDate, setDepartureDate] = useState(getDateInputValue(1));
	const [quantity, setQuantity] = useState(1);
	const [seatNumbers, setSeatNumbers] = useState("");
	const [paymentMethodId, setPaymentMethodId] = useState(3);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		if (!show) {
			return;
		}

		setDepartureDate(getDateInputValue(1));
		setQuantity(1);
		setSeatNumbers("");
		setPaymentMethodId(3);
		setSubmitError("");
		setSubmitSuccess("");
	}, [show]);

	const priceValue = useMemo(() => {
		const src = transportation?.pricePerTicket ?? transportation?.price ?? 0;
		const n = Number(src);
		return Number.isFinite(n) ? n : 0;
	}, [transportation?.pricePerTicket, transportation?.price]);

	const totalAmount = priceValue * quantity;
	const bookingDay = formatBookingDate(departureDate);

	async function handleSubmit(event) {
		event.preventDefault();

		const serviceId = transportation?.id ?? transportation?.baseInfo?.id;
		const seatNote = seatNumbers.trim();

		if (!serviceId) {
			setSubmitError("Không tìm thấy dịch vụ để đặt vé.");
			return;
		}

		if (!departureDate) {
			setSubmitError("Vui lòng chọn ngày khởi hành.");
			return;
		}

		if (!seatNote) {
			setSubmitError("Vui lòng nhập số ghế.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError("");
		setSubmitSuccess("");

		try {
			await createBooking({
				serviceId,
				paymentMethodId,
				bookingDay,
				quantity,
				note: seatNote,
			});

			if (paymentMethodId === 2) {
				await openMomoPaymentForBooking({
					serviceName: transportation?.name,
					bookingDay,
					quantity,
					note: seatNote,
					paymentMethodId,
				});
				return;
			}

			setSubmitSuccess("Đặt vé thành công. Thông tin ghế của bạn đã được lưu.");
			setTimeout(() => {
				onHide?.();
				navigate("/history");
			}, 5000);
		} catch (error) {
			setSubmitError(error?.response?.data?.message || "Không thể tạo booking, vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Modal show={show} onHide={onHide} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Chi tiết đặt vé</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body className="p-4">
					<div className="mb-4">
						<h5 className="fw-semibold mb-1">{transportation?.name}</h5>
						<div className="text-body-secondary">
							{transportation?.departureLocation || transportation?.departure_location}
							{" → "}
							{transportation?.arrivalLocation || transportation?.arrival_location}
						</div>
					</div>

					{submitSuccess ? <div className="alert alert-success py-2">{submitSuccess}</div> : null}
					{submitError ? <div className="alert alert-danger py-2">{submitError}</div> : null}

					<Row className="g-3">
						<Col xs={12} md={6}>
							<Form.Label>Chọn ngày khởi hành</Form.Label>
							<Form.Control
								type="date"
								value={departureDate}
								onChange={(event) => setDepartureDate(event.target.value)}
							/>
						</Col>

						<Col xs={12} md={6}>
							<Form.Label>Chọn số vé</Form.Label>
							<Form.Control
								type="number"
								min="1"
								max={
									transportation?.availableSeats ??
									transportation?.availability_count ??
									undefined
								}
								value={quantity}
								onChange={(event) =>
									setQuantity(
										Math.min(
											Math.max(1, Number(event.target.value) || 1),
											transportation?.availableSeats ??
											transportation?.availability_count ??
											Number.POSITIVE_INFINITY,
										),
									)
								}
							/>
							<div className="text-body-secondary small mt-1">
								Còn lại {transportation?.availableSeats ?? transportation?.availability_count ?? 0} chỗ
							</div>
						</Col>

						<Col xs={12}>
							<Form.Label>Chọn số ghế</Form.Label>
							<Form.Control
								as="textarea"
								rows={2}
								placeholder="Ví dụ: A1, A2 hoặc 12, 13"
								value={seatNumbers}
								onChange={(event) => setSeatNumbers(event.target.value)}
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

						<Col xs={12} md={6}>
							<div className="rounded-3 bg-light p-3 h-100 d-flex flex-column justify-content-between gap-2">
								<div className="d-flex justify-content-between gap-3">
									<span className="text-body-secondary">Đơn giá</span>
									<span className="fw-semibold text-end">
										{formatCurrency(priceValue)}
									</span>
								</div>
								<div className="d-flex justify-content-between gap-3">
									<span className="text-body-secondary">Tổng tiền</span>
									<span className="fw-bold text-success text-end">
										{formatCurrency(totalAmount)}
									</span>
								</div>
								<div className="d-flex justify-content-between gap-3">
									<span className="text-body-secondary">Ngày khởi hành</span>
									<span className="fw-semibold text-end">{bookingDay}</span>
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
						{isSubmitting ? "Đang xử lý..." : "Xác nhận đặt vé"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default ModalConfirmTransportationBooking;
