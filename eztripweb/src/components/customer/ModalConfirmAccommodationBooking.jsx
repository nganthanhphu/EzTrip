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

function ModalConfirmAccommodationBooking({ show, onHide, accommodation }) {
	const [checkInDate, setCheckInDate] = useState(getDateInputValue(1));
	const [checkOutDate, setCheckOutDate] = useState(getDateInputValue(2));
	const [quantity, setQuantity] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");

	useEffect(() => {
		if (!show) {
			return;
		}

		setCheckInDate(getDateInputValue(1));
		setCheckOutDate(getDateInputValue(2));
		setQuantity(1);
		setPaymentMethod("BANK_TRANSFER");
	}, [show]);

	const totalAmount = (accommodation?.baseInfo?.price ?? 0) * quantity;

	function handleSubmit(event) {
		event.preventDefault();
		onHide?.();
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
							</div>
						</Col>
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="outline-secondary" onClick={onHide}>
						Hủy
					</Button>
					<Button type="submit" variant="primary">
						Xác nhận đặt phòng
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default ModalConfirmAccommodationBooking;
