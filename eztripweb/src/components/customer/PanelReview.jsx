import { Badge, Card, Image, ListGroup } from "react-bootstrap";
import moment from "moment";
import "moment/locale/vi";

function PanelReview({ reviews = [] }) {
	const reviewList = reviews;

	return (
        <Card className="h-100 shadow-sm">
            <Card.Header className="bg-white fw-semibold">Đánh giá</Card.Header>
            <Card.Body className="p-0">
                {reviewList.length > 0 ? (
                    <ListGroup variant="flush">
                        {reviewList.map((review, index) => (
                            <ListGroup.Item
                                key={
                                    review.id ??
                                    `${review.reviewName ?? "review"}-${index}`
                                }
                                className="py-3"
                            >
                                <div className="d-flex align-items-start gap-3">
                                    {review.reviewAvatar ? (
                                        <Image
                                            src={review.reviewAvatar}
                                            alt={
                                                review.reviewName ||
                                                "Avatar khách hàng"
                                            }
                                            roundedCircle
                                            className="flex-shrink-0 border"
                                            style={{
                                                width: 52,
                                                height: 52,
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="flex-shrink-0 rounded-circle border bg-body-tertiary d-flex align-items-center justify-content-center text-uppercase fw-semibold text-body-secondary"
                                            style={{ width: 52, height: 52 }}
                                            aria-hidden="true"
                                        >
                                            {review.reviewName}
                                        </div>
                                    )}

                                    <div className="flex-grow-1 min-w-0">
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <div className="min-w-0">
                                                <div className="fw-semibold text-truncate">
                                                    {review.reviewName ||
                                                        "Khách hàng"}
                                                </div>
                                                <div className="text-body-secondary small">
                                                    {moment(
                                                        review.reviewDate,
                                                        "DD/MM/YYYY HH:mm",
                                                    ).fromNow() || ""}
                                                </div>
                                            </div>
                                            <Badge
                                                bg="warning"
                                                text="dark"
                                                className="flex-shrink-0 px-3 py-2"
                                            >
                                                {Number(review.rating) || 0}/10
                                            </Badge>
                                        </div>
                                        <div className="mt-2 text-body">
                                            {review.comment || ""}
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <div className="p-3 text-body-secondary">
                        Chưa có đánh giá nào.
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default PanelReview;
