import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
import PanelAlbum from "@components/customer/PanelAlbum";
import PanelProviderInfo from "@components/customer/PanelProviderInfo";
import PanelReview from "@components/customer/PanelReview";
import PanelCompare from "@components/customer/PanelCompare";
import ModalConfirmAccommodationBooking from "@components/customer/ModalConfirmAccommodationBooking";
import MySpinner from "@components/common/MySpinner";
import { getAccommodationById } from "@services/customerService";

function AccommodationDetail() {
	const [showBookingModal, setShowBookingModal] = useState(false);
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [accommodationDetail, setAccommodationDetail] = useState(null);

	const loadAccommodationDetail = async (id) => {
		try {
			setError("");
			setLoading(true);
			const response = await getAccommodationById(id);
			console.log("Accommodation detail:", response);
			setAccommodationDetail(response);
		} catch (error) {
			console.error("Error fetching accommodations:", error);
			setError("Không thể tải thông tin chỗ nghỉ. Vui lòng thử lại sau.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadAccommodationDetail(id);
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

	if (error || !accommodationDetail) {
		return (
			<CustomerLayout>
				<Container className="py-4">
					<Alert variant="warning" className="mb-0">
						{error || "Không tìm thấy thông tin chỗ nghỉ."}
					</Alert>
				</Container>
			</CustomerLayout>
		);
	}

	return (
		<CustomerLayout>
			<Container className="py-4">
				<Row className="g-4 mb-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<PanelAlbum urls={accommodationDetail.baseInfo.images} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Thông tin dịch vụ
							</Card.Header>
							<Card.Body className="d-flex flex-column justify-content-between gap-3">
								<div>
									<h1 className="h3 fw-semibold mb-2">{accommodationDetail.baseInfo.name}</h1>
									<div className="text-body-secondary mb-3">
										{accommodationDetail.location}
									</div>

									<ListGroup variant="flush" className="mb-3">
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Số giường</span>
											<Badge bg="secondary">{accommodationDetail.quantityOfBed}</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Diện tích</span>
											<Badge bg="secondary">{accommodationDetail.area} m²</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Giá</span>
											<Badge bg="success">{accommodationDetail.baseInfo.price}</Badge>
										</ListGroup.Item>
									</ListGroup>
								</div>

								<div className="d-grid">
									<Button variant="primary" size="lg" onClick={() => setShowBookingModal(true)}>
										Book ngay!!!
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xs={12} lg={3}>
						<PanelProviderInfo
							avatarUrl={accommodationDetail.baseInfo.companyAvatar}
							name={accommodationDetail.baseInfo.companyName}
							address={accommodationDetail.baseInfo.companyAddress}
							phone={accommodationDetail.baseInfo.companyPhone}
							email={accommodationDetail.baseInfo.companyEmail}
						/>
					</Col>
				</Row>

				<Row className="g-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<PanelReview reviews={accommodationDetail.baseInfo.id} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Mô tả dịch vụ
							</Card.Header>
							<Card.Body>
								<p className="mb-0">{accommodationDetail.baseInfo.description}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col xs={12} lg={3}>
						<PanelCompare services={accommodationDetail.AccommodationDetail} />
					</Col>
				</Row>

					<ModalConfirmAccommodationBooking
						show={showBookingModal}
						onHide={() => setShowBookingModal(false)}
						accommodation={accommodationDetail}
					/>
			</Container>
		</CustomerLayout>
	);
}

export default AccommodationDetail;
