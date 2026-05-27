import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

const PAYMENT_METHODS = [
	{ value: "CASH", label: "Tiền mặt" },
	{ value: "MOMO", label: "MOMO" },
	{ value: "BANK_TRANSFER", label: "Chuyển khoản" },
];

function formatCurrency(value) {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
}

function getDateInputValue(offsetDays = 0) {
	const date = new Date();
	date.setDate(date.getDate() + offsetDays);
	return date.toISOString().split("T")[0];
}

function ModalConfirmTransportationBooking({ show, onHide, transportation }) {
	const [departureDate, setDepartureDate] = useState(getDateInputValue(1));
	const [quantity, setQuantity] = useState(1);
	const [seatNumbers, setSeatNumbers] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");

	useEffect(() => {
		if (!show) {
			return;
		}

		setDepartureDate(getDateInputValue(1));
		setQuantity(1);
		setSeatNumbers("");
		setPaymentMethod("BANK_TRANSFER");
	}, [show]);

	const priceValue = useMemo(() => {
		const parsedPrice = Number(String(transportation?.price ?? 0).replace(/[^0-9]/g, ""));
		return Number.isFinite(parsedPrice) ? parsedPrice : 0;
	}, [transportation?.price]);

	const totalAmount = priceValue * quantity;

	function handleSubmit(event) {
		event.preventDefault();
		onHide?.();
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
							{transportation?.departure_location} → {transportation?.arrival_location}
						</div>
					</div>

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
								max={transportation?.avaibility_count ?? undefined}
								value={quantity}
								onChange={(event) =>
									setQuantity(
										Math.min(
											Math.max(1, Number(event.target.value) || 1),
											transportation?.avaibility_count ?? Number.POSITIVE_INFINITY,
										),
									)
								}
							/>
							<div className="text-body-secondary small mt-1">
								Còn lại {transportation?.avaibility_count ?? 0} chỗ
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
								value={paymentMethod}
								onChange={(event) => setPaymentMethod(event.target.value)}
							>
								{PAYMENT_METHODS.map((method) => (
									<option key={method.value} value={method.value}>
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
							</div>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={onHide}>
						Hủy
					</Button>
					<Button type="submit" variant="primary">
						Xác nhận đặt vé
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default ModalConfirmTransportationBooking;
