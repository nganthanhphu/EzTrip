import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import customerService from "@services/customerService";
import { formatDateTime } from "@utils/formatters";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

function ModalReview({ show, onHide, bookingId, serviceName, review, onSaved }) {
	const initialReview = review ?? null;
	const [draft, setDraft] = useState({ rating: 10, comment: "" });
	const [currentReview, setCurrentReview] = useState(initialReview);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!show) {
			return;
		}

		setCurrentReview(initialReview);
		setDraft({
			rating: initialReview?.rating ?? 10,
			comment: initialReview?.comment ?? "",
		});
		setError("");
	}, [show, initialReview]);

	const isReviewed = Boolean(currentReview);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setDraft((currentDraft) => ({
			...currentDraft,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!bookingId) {
			setError("Không tìm thấy mã booking để gửi đánh giá.");
			return;
		}

		setSaving(true);
		setError("");

		try {
			await customerService.createReview(bookingId, {
				rating: Number(draft.rating),
				comment: draft.comment.trim(),
			});

			const nextReview = {
				rating: Number(draft.rating),
				comment: draft.comment.trim(),
				reviewDate: new Date().toISOString(),
			};

			setCurrentReview(nextReview);
			onSaved?.(nextReview);
			queryClient.invalidateQueries({ queryKey: ["bookings"] });
            navigate("/history");

		} catch (submitError) {
			setError(submitError?.response?.data?.error || "Không thể gửi đánh giá.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal show={show} onHide={onHide} centered size="lg" backdrop="static" scrollable>
			<Modal.Header closeButton>
				<Modal.Title>Viết đánh giá</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="mb-3">
					<div className="text-body-secondary small">Dịch vụ</div>
					<div className="fw-semibold">{serviceName || "Dịch vụ đã đặt"}</div>
				</div>

				{error ? <Alert variant="danger">{error}</Alert> : null}

				{isReviewed ? (
					<div className="border rounded-4 p-3 bg-light-subtle">
						<Row className="g-3 align-items-start">
							<Col xs={12} md={4}>
								<div className="p-3 rounded-4 bg-white border h-100">
									<div className="text-body-secondary small mb-1">Điểm đánh giá</div>
									<div className="d-flex align-items-center gap-2">
										<Badge bg="warning" text="dark" className="px-3 py-2 fs-6">
											{currentReview.rating}/10
										</Badge>
										<span className="text-body-secondary small">Đã gửi</span>
									</div>
									<div className="text-body-secondary small mt-3">Thời gian</div>
									<div className="fw-semibold">{formatDateTime(currentReview.reviewDate)}</div>
								</div>
							</Col>
							<Col xs={12} md={8}>
								<Form.Group controlId="reviewCommentView">
									<Form.Label>Nội dung đánh giá</Form.Label>
									<Form.Control
										as="textarea"
										rows={7}
										value={currentReview.comment}
										readOnly
									/>
								</Form.Group>
							</Col>
						</Row>
					</div>
				) : (
					<Form onSubmit={handleSubmit}>
						<Row className="g-3">
							<Col xs={12} md={4}>
								<Form.Group controlId="reviewRating">
									<Form.Label>Điểm đánh giá</Form.Label>
									<Form.Select name="rating" value={draft.rating} onChange={handleChange}>
										{Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
											<option key={score} value={score}>
												{score}
											</option>
										))}
									</Form.Select>
								</Form.Group>
							</Col>
							<Col xs={12} md={8}>
								<Form.Group controlId="reviewComment">
									<Form.Label>Chi tiết đánh giá</Form.Label>
									<Form.Control
										name="comment"
										as="textarea"
										rows={7}
										value={draft.comment}
										onChange={handleChange}
										placeholder="Nhập cảm nhận của bạn về dịch vụ"
									/>
								</Form.Group>
							</Col>
						</Row>
					</Form>
				)}
			</Modal.Body>
			<Modal.Footer>
				{isReviewed ? (
					<Button variant="primary" onClick={onHide}>
						Đóng
					</Button>
				) : (
					<>
						<Button variant="outline-secondary" onClick={onHide} disabled={saving}>
							Hủy
						</Button>
						<Button variant="primary" onClick={handleSubmit} disabled={saving}>
							{saving ? (
								<>
									<Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
									Đang gửi
								</>
							) : (
								"Gửi đánh giá"
							)}
						</Button>
					</>
				)}
			</Modal.Footer>
		</Modal>
	);
}

export default ModalReview;
