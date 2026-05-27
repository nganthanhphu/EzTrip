import { Badge, Card, ListGroup } from "react-bootstrap";

function PanelReview({ reviews = [] }) {
	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">
				Đánh giá
			</Card.Header>
			<Card.Body className="p-0">
				{reviews.length > 0 ? (
					<ListGroup variant="flush">
						{reviews.map((review, index) => (
							<ListGroup.Item key={`${review.reviewer}-${index}`} className="py-3">
								<div className="d-flex justify-content-between align-items-start gap-3 mb-2">
									<div>
										<div className="fw-semibold">{review.reviewer}</div>
										<div className="text-body-secondary small">{review.date}</div>
									</div>
									<Badge bg="warning" text="dark">
										{review.rating}/10
									</Badge>
								</div>
								<div>{review.comment}</div>
							</ListGroup.Item>
						))}
					</ListGroup>
				) : (
					<div className="p-3 text-body-secondary">Chưa có đánh giá nào.</div>
				)}
			</Card.Body>
		</Card>
	);
}

export default PanelReview;
