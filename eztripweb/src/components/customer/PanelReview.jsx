import { useState } from "react";
import { Badge, Card, Image, ListGroup, Button, Alert, Spinner } from "react-bootstrap";
import moment from "moment";
import "moment/locale/vi";
import geminiService from "@services/geminiService";

function PanelReview({ reviews = [] }) {
    const reviewList = reviews;

    const [aiSummary, setAiSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState("");

    const handleGenerateSummary = async () => {
        try {
            setIsSummarizing(true);
            setError("");
            const summary = await geminiService.summarizeReviews(reviewList);
            setAiSummary(summary);
        } catch (err) {
            setError(err.message || "Không thể tóm tắt lúc này.");
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <Card className="h-100 shadow-sm d-flex flex-column">
            <Card.Header className="bg-white fw-semibold d-flex justify-content-between align-items-center flex-shrink-0">
                <span>Đánh giá khách hàng</span>
                {reviewList.length > 0 && (
                    <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={handleGenerateSummary}
                        disabled={isSummarizing}
                    >
                        {isSummarizing ? (
                            <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1"/> Đang phân tích...</>
                        ) : (
                            "Xem tổng quan"
                        )}
                    </Button>
                )}
            </Card.Header>
            
            <Card.Body className="p-0 d-flex flex-column overflow-hidden">
                <div className="flex-shrink-0">
                    {error && <Alert variant="danger" className="m-3 p-2 text-center small">{error}</Alert>}

                    {aiSummary && (
                        <div className="m-3 p-3 bg-primary-subtle border border-primary rounded text-dark">
                            <div className="fw-semibold mb-1 d-flex align-items-center gap-2">
                                <span>Tổng quan đánh giá</span>
                            </div>
                            <p className="mb-0 small">{aiSummary}</p>
                        </div>
                    )}
                </div>

                <div className="overflow-y-auto flex-grow-1" style={{ maxHeight: "300px" }}>
                    {reviewList.length > 0 ? (
                        <ListGroup variant="flush">
                            {reviewList.map((review, index) => (
                                <ListGroup.Item
                                    key={review.id ?? `${review.reviewName ?? "review"}-${index}`}
                                    className="py-3"
                                >
                                    <div className="d-flex align-items-start gap-3">
                                        {review.reviewAvatar ? (
                                            <Image
                                                src={review.reviewAvatar}
                                                alt={review.reviewName || "Avatar khách hàng"}
                                                roundedCircle
                                                className="flex-shrink-0 border"
                                                style={{ width: 52, height: 52, objectFit: "cover" }}
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
                                                        {review.reviewName || "Khách hàng"}
                                                    </div>
                                                    <div className="text-body-secondary small">
                                                        {moment(review.reviewDate, "DD/MM/YYYY HH:mm").fromNow() || ""}
                                                    </div>
                                                </div>
                                                <Badge bg="warning" text="dark" className="flex-shrink-0 px-3 py-2">
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
                </div>
            </Card.Body>
        </Card>
    );
}

export default PanelReview;