import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import customerService from "@services/customerService";
import { formatCurrency, formatBookingDate } from "@utils/formatters";

const PAYMENT_METHODS = [
    { id: 1, label: "Tiền mặt" },
    { id: 2, label: "Momo" },
    { id: 3, label: "Chuyển khoản" },
    { id: 4, label: "ZaloPay" }
];

function getDateInputValue(offsetDays = 0) {
	const date = new Date();
	date.setDate(date.getDate() + offsetDays);
	return date.toISOString().split("T")[0];
}

function ModalConfirmTourBooking({ show, onHide, tour }) {
	const [tourDate, setTourDate] = useState(getDateInputValue(1));
	const [quantity, setQuantity] = useState(1);
	const [note, setNote] = useState("");
	const [paymentMethodId, setPaymentMethodId] = useState(3);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState("");
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	useEffect(() => {
		if (!show) {
			return;
		}

		setTourDate(getDateInputValue(1));
		setQuantity(1);
		setNote("");
		setPaymentMethodId(3);
		setSubmitError("");
		setSubmitSuccess("");
	}, [show]);

	const totalAmount = useMemo(
		() => (tour?.pricePerTicket ?? 0) * quantity,
		[tour?.pricePerTicket, quantity],
	);
	const bookingDay = formatBookingDate(tourDate);

	async function handleSubmit(event) {
		event.preventDefault();

		const serviceId = tour?.id ?? tour?.baseInfo?.id;

		if (!serviceId) {
			setSubmitError("Không tìm thấy dịch vụ để đặt tour.");
			return;
		}

		if (!tourDate) {
			setSubmitError("Vui lòng chọn ngày đi tour.");
			return;
		}

		setIsSubmitting(true);
		setSubmitError("");
		setSubmitSuccess("");

		try {
			await customerService.createBooking({
				serviceId,
				paymentMethodId,
				bookingDay,
				quantity,
				note: note.trim(),
			});

			setSubmitSuccess("Đặt tour thành công. Vui lòng kiểm tra thông tin trong lịch sử đặt chỗ.");
			setTimeout(() => {
				onHide?.();
				queryClient.invalidateQueries({ queryKey: ["bookings"] });
                navigate("/history");
			}, 1000);
		} catch (error) {
			setSubmitError(error?.response?.data?.message || "Không thể tạo booking, vui lòng thử lại.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Modal show={show} onHide={onHide} centered size="lg">
			<Modal.Header closeButton>
				<Modal.Title>Chi tiết đặt tour</Modal.Title>
			</Modal.Header>
			<Form onSubmit={handleSubmit}>
				<Modal.Body className="p-4">
					<div className="mb-4">
						<h5 className="fw-semibold mb-1">{tour?.name}</h5>
						<div className="text-body-secondary">{tour?.location}</div>
					</div>

					{submitSuccess ? <div className="alert alert-success py-2">{submitSuccess}</div> : null}
					{submitError ? <div className="alert alert-danger py-2">{submitError}</div> : null}

					<Row className="g-3">
						<Col xs={12} md={6}>
							<Form.Label>Chọn ngày đi tour</Form.Label>
							<Form.Control
								type="date"
								value={tourDate}
								onChange={(event) => setTourDate(event.target.value)}
							/>
						</Col>

						<Col xs={12} md={6}>
							<Form.Label>Số lượng khách</Form.Label>
							<Form.Control
								type="number"
								min="1"
								max={tour?.availableSeats ?? undefined}
								value={quantity}
								onChange={(event) =>
									setQuantity(
										Math.min(
											Math.max(1, Number(event.target.value) || 1),
											tour?.availableSeats ?? Number.POSITIVE_INFINITY,
										),
									)
								}
							/>
							<div className="text-body-secondary small mt-1">
								Còn lại {tour?.availableSeats ?? 0} chỗ
							</div>
						</Col>

						<Col xs={12}>
							<Form.Label>Ghi chú cho hướng dẫn viên</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Nhập yêu cầu thêm nếu có"
								value={note}
								onChange={(event) => setNote(event.target.value)}
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
										{formatCurrency(tour?.pricePerTicket ?? 0)}
									</span>
								</div>
								<div className="d-flex justify-content-between gap-3">
									<span className="text-body-secondary">Tổng tiền</span>
									<span className="fw-bold text-success text-end">
										{formatCurrency(totalAmount)}
									</span>
								</div>
								<div className="d-flex justify-content-between gap-3">
									<span className="text-body-secondary">Ngày đi</span>
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
						{isSubmitting ? "Đang xử lý..." : "Xác nhận đặt tour"}
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}

export default ModalConfirmTourBooking;
