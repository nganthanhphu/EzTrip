import { useState } from "react";
import { Badge, Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import CustomerLayout from "@layouts/CustomerLayout";
import AlbumPanel from "@components/customer/PanelAlbum";
import ProviderInfoPanel from "@components/customer/PanelProviderInfo";
import ReviewPanel from "@components/customer/PanelReview";
import ComparePanel from "@components/customer/PanelCompare";
import ModalConfirmTourBooking from "@components/customer/ModalConfirmTourBooking";
import defaultTourImage from "../../assets/images/default_tour_item.jpg";

const tourDetail = {
	name: "Khám phá Hoa Hồng",
	location: "Phường Văn Xá, TP.HCM",
	duration: "2 ngày 1 đêm",
	availableSeats: 18,
	pricePerTicket: 1250000,
	price: "1.250.000 VNĐ / khách",
	description:
		"Tour khởi hành linh hoạt, lịch trình gọn, có hướng dẫn viên đi cùng và phù hợp cho nhóm nhỏ muốn tham quan, nghỉ dưỡng kết hợp trải nghiệm địa phương.",
	images: [defaultTourImage, defaultTourImage, defaultTourImage],
	provider: {
		avatarUrl: defaultTourImage,
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
			comment: "Lịch trình hợp lý, hướng dẫn viên nhiệt tình và dịch vụ đúng cam kết.",
		},
		{
			reviewer: "Trần Thị B",
			date: "10/05/2026",
			rating: 8,
			comment: "Tour đi nhẹ nhàng, phù hợp đi cùng gia đình và bạn bè.",
		},
	],
	compareServices: [
		{
			name: "Tour Hoa Mai",
			providerName: "HappyCorp Travel",
			imageUrl: defaultTourImage,
		},
		{
			name: "Tour Hoa Đào",
			providerName: "City Travel",
			imageUrl: defaultTourImage,
		},
		{
			name: "Tour Ven Biển",
			providerName: "Ocean Escape",
			imageUrl: defaultTourImage,
		},
	],
};

function TourDetail() {
	const [showBookingModal, setShowBookingModal] = useState(false);

	return (
		<CustomerLayout>
			<Container className="py-4">
				<Row className="g-4 mb-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<AlbumPanel urls={tourDetail.images} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Thông tin dịch vụ
							</Card.Header>
							<Card.Body className="d-flex flex-column justify-content-between gap-3">
								<div>
									<h1 className="h3 fw-semibold mb-2">{tourDetail.name}</h1>
									<div className="text-body-secondary mb-3">
										{tourDetail.location}
									</div>

									<ListGroup variant="flush" className="mb-3">
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Thời lượng</span>
											<Badge bg="secondary">{tourDetail.duration}</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Số chỗ còn lại</span>
											<Badge bg="secondary">{tourDetail.availableSeats}</Badge>
										</ListGroup.Item>
										<ListGroup.Item className="px-0 d-flex justify-content-between align-items-center">
											<span>Giá</span>
											<Badge bg="success">{tourDetail.price}</Badge>
										</ListGroup.Item>
									</ListGroup>
								</div>

								<div className="d-grid">
									<Button
										variant="primary"
										size="lg"
										onClick={() => setShowBookingModal(true)}
									>
										Book ngay!!!
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>

					<Col xs={12} lg={3}>
						<ProviderInfoPanel {...tourDetail.provider} />
					</Col>
				</Row>

				<Row className="g-4 align-items-stretch">
					<Col xs={12} lg={4}>
						<ReviewPanel reviews={tourDetail.reviews} />
					</Col>

					<Col xs={12} lg={5}>
						<Card className="h-100 shadow-sm">
							<Card.Header className="bg-white fw-semibold">
								Mô tả dịch vụ
							</Card.Header>
							<Card.Body>
								<p className="mb-0">{tourDetail.description}</p>
							</Card.Body>
						</Card>
					</Col>

					<Col xs={12} lg={3}>
						<ComparePanel services={tourDetail.compareServices} />
					</Col>
				</Row>

				<ModalConfirmTourBooking
					show={showBookingModal}
					onHide={() => setShowBookingModal(false)}
					tour={tourDetail}
				/>
			</Container>
		</CustomerLayout>
	);
}

export default TourDetail;
