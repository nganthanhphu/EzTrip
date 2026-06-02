import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { Alert, Badge, Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
import PanelAlbum from "@components/customer/PanelAlbum";
import PanelProviderInfo from "@components/customer/PanelProviderInfo";
import ReviewPanel from "@components/customer/PanelReview";
import PanelCompare from "@components/customer/PanelCompare";
import ModalConfirmTourBooking from "@components/customer/ModalConfirmTourBooking";
import MySpinner from "@components/common/MySpinner";
import { getReviewsByServiceId, getTourismById } from "@services/customerService";
import { formatCurrency } from "@utils/formatters";

function TourDetail() {
    const [showBookingModal, setShowBookingModal] = useState(false);
	const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [tourDetail, setTourDetail] = useState(null);
	const [reviews, setReviews] = useState([]);

	const loadTourDetail = async (tourismId) => {
		try {
			setError("");
			setLoading(true);
			const response = await getTourismById(tourismId);
			setTourDetail(response);

			const serviceId = response?.baseInfo?.id ?? tourismId;
			const reviewResponse = await getReviewsByServiceId(serviceId).catch(() => []);
            setReviews(reviewResponse || []);
		} catch (requestError) {
			console.error("Error fetching tours:", requestError);
			setError("Không thể tải thông tin tour. Vui lòng thử lại sau.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadTourDetail(id);
	}, [id]);

	if (loading) {
		return (
			<CustomerLayout>
				<Container className="py-5 d-flex justify-content-center align-items-center">
					<MySpinner />
				</Container>
			</CustomerLayout>
		);
	}

	if (error || !tourDetail) {
		return (
			<CustomerLayout>
				<Container className="py-4">
					<Alert variant="warning" className="mb-0">
						{error || "Không tìm thấy thông tin tour."}
					</Alert>
				</Container>
			</CustomerLayout>
		);
	}

    const { baseInfo, location: serviceLocation, tourDuration } = tourDetail;
    const bookingTour = {
        id: baseInfo?.id,
        name: baseInfo?.name,
        location: serviceLocation,
        pricePerTicket: baseInfo?.price,
        availableSeats: baseInfo?.remainingQuantity,
        images: baseInfo?.images,
        description: baseInfo?.description,
        duration: tourDuration,
    };

	return (
        <CustomerLayout>
            <Container className="py-4">
                <Row className="g-4 mb-4 align-items-stretch">
                    <Col xs={12} lg={4}>
                        <PanelAlbum images={baseInfo?.images} />
                    </Col>

                    <Col xs={12} lg={5}>
                        <Card className="h-100 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">
                                Thông tin dịch vụ
                            </Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-between gap-3">
                                <div>
                                    <h1 className="h3 fw-semibold mb-2">
                                        {baseInfo?.name}
                                    </h1>
                                    <div className="text-body-secondary mb-3">
                                        {serviceLocation}
                                    </div>

                                    <ListGroup variant="flush" className="mb-3">
                                        <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                                            <span>Thời lượng</span>
                                            <Badge bg="secondary">
                                                {tourDuration} ngày
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                                            <span>Tổng số lượng</span>
                                            <Badge bg="secondary">
                                                {baseInfo?.quantity}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                                            <span>Số chỗ còn lại</span>
                                            <Badge bg="secondary">
                                                {baseInfo?.remainingQuantity}
                                            </Badge>
                                        </ListGroup.Item>
                                        <ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
                                            <span>Giá</span>
                                            <Badge bg="success">
                                                {formatCurrency(
                                                    baseInfo?.price ?? 0,
                                                )}
                                            </Badge>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </div>

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        onClick={() => {
                                            if (!currentUser) {
                                                navigate("/login", { state: { from: location.pathname } });
                                                return;
                                            }

                                            setShowBookingModal(true);
                                        }}
                                    >
                                        Book ngay!!!
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} lg={3}>
                        <PanelProviderInfo
                            key={tourDetail.id}
                            {...tourDetail.baseInfo?.providerInfo}
                        />
                    </Col>
                </Row>

                <Row className="g-4 align-items-stretch">
                    <Col xs={12} lg={4}>
                        <PanelCompare
                            currentService={tourDetail}
                            serviceType="tourism"
                        />
                    </Col>
                    <Col xs={12} lg={5}>
                        <Card className="h-100 shadow-sm">
                            <Card.Header className="bg-white fw-semibold">
                                Mô tả dịch vụ
                            </Card.Header>
                            <Card.Body>
                                <p className="mb-0">{baseInfo?.description}</p>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col xs={12} lg={3}>
                        <ReviewPanel reviews={reviews} />
                    </Col>
                </Row>

                <ModalConfirmTourBooking
                    show={showBookingModal}
                    onHide={() => setShowBookingModal(false)}
                    tour={bookingTour}
                />
            </Container>
        </CustomerLayout>
    );
}

export default TourDetail;
