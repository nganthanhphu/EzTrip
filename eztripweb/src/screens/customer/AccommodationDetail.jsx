import { useState } from "react";
import { Badge, Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import PanelAlbum from "@components/customer/PanelAlbum";
import PanelProviderInfo from "@components/customer/PanelProviderInfo";
import PanelReview from "@components/customer/PanelReview";
import PanelCompare from "@components/customer/PanelCompare";
import ModalConfirmAccommodationBooking from "@components/customer/ModalConfirmAccommodationBooking";
import defaultAccommodationImage from "../../assets/images/default_accommodation_item.jpg";

const accommodationDetail = {
	name: "Khách sạn Hoa Hồng",
	address: "Phường Văn Xá, TP.HCM",
	beds: 2,
	area: 15,
	pricePerNight: 300000,
	price: "300.000 VNĐ / đêm",
	description:
		"Phòng nghỉ rộng rãi, phù hợp cho 2 khách, có cửa sổ thoáng, nội thất cơ bản sạch sẽ và thuận tiện di chuyển đến trung tâm thành phố.",
	images: [defaultAccommodationImage, defaultAccommodationImage, defaultAccommodationImage],
	provider: {
		avatarUrl: defaultAccommodationImage,
		name: "HappyCorp Travel",
		address: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
		phone: "0123456789",
		email: "hello@happycorp.vn",
	},
	reviews: [
		{
			reviewer: "Nguyễn Văn A",
			date: "12/05/2026",
			rating: 9,
			comment: "Phòng sạch sẽ, đúng như mô tả và nhân viên hỗ trợ rất nhanh.",
		},
		{
			reviewer: "Trần Thị B",
			date: "10/05/2026",
			rating: 8,
			comment: "Vị trí thuận tiện, giá hợp lý cho chuyến đi ngắn ngày.",
		},
	],
	compareServices: [
		{
			name: "Khách sạn Hoa Mai",
			providerName: "HappyCorp Travel",
			imageUrl: defaultAccommodationImage,
		},
		{
			name: "Homestay Hoa Đào",
			providerName: "City Stay",
			imageUrl: defaultAccommodationImage,
		},
		{
			name: "Resort Ven Sông",
			providerName: "River Escape",
			imageUrl: defaultAccommodationImage,
		},
	],
};

function AccommodationDetail() {
	const [showBookingModal, setShowBookingModal] = useState(false);

	return (
		<CustomerLayout>
			<Container className="py-4">
				<Row className="g-4 mb-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<PanelAlbum urls={accommodationDetail.images} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Thông tin dịch vụ
							</Card.Header>
							<Card.Body className="d-flex flex-column justify-content-between gap-3">
								<div>
									<h1 className="h3 fw-semibold mb-2">{accommodationDetail.name}</h1>
									<div className="text-body-secondary mb-3">
										{accommodationDetail.address}
									</div>

									<ListGroup variant="flush" className="mb-3">
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Số giường</span>
											<Badge bg="secondary">{accommodationDetail.beds}</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Diện tích</span>
											<Badge bg="secondary">{accommodationDetail.area} m²</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Giá</span>
											<Badge bg="success">{accommodationDetail.price}</Badge>
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
						<PanelProviderInfo {...accommodationDetail.provider} />
					</Col>
				</Row>

				<Row className="g-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<PanelReview reviews={accommodationDetail.reviews} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Mô tả dịch vụ
							</Card.Header>
							<Card.Body>
								<p className="mb-0">{accommodationDetail.description}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col xs={12} lg={3}>
						<PanelCompare services={accommodationDetail.compareServices} />
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
