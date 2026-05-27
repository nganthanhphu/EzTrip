import { Button, Card, Image, ListGroup } from "react-bootstrap";
import defaultAccommodationImage from "../../assets/images/default_accommodation_item.jpg";

function PanelProviderInfo({
	avatarUrl = defaultAccommodationImage,
	name = "Nhà cung cấp",
	address = "Địa chỉ chưa cập nhật",
	phone = "Chưa có số điện thoại",
	email = "Chưa có email",
	onChat,
}) {
	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">
				Thông tin nhà cung cấp
			</Card.Header>
			<Card.Body>
				<div className="d-flex justify-content-center mb-3">
					<Image
						src={avatarUrl}
						alt={name}
						roundedCircle
						width={128}
						height={128}
						className="border"
					/>
				</div>

				<Card.Title className="text-center mb-3">{name}</Card.Title>

				<ListGroup variant="flush" className="mb-3">
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">Địa chỉ:</span> {address}
					</ListGroup.Item>
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">SĐT:</span> {phone}
					</ListGroup.Item>
					<ListGroup.Item className="px-0">
						<span className="fw-semibold">Email:</span> {email}
					</ListGroup.Item>
				</ListGroup>

				<div className="d-grid">
					<Button variant="primary" onClick={onChat}>
						Chat ngay
					</Button>
				</div>
			</Card.Body>
		</Card>
	);
}

export default PanelProviderInfo;
