import { Badge, Button, Card, Col, Image, Row } from "react-bootstrap";
import defaultImage from "../../assets/images/default_tour_item.jpg";

function CardServiceItem({
	id,
	provider_id,
	name = "Dịch vụ Du lịch A",
	description = "Mô tả dịch vụ",
	price = 450000,
	quantity = 1,
	type_of_service_id,
	type_of_service_name = "Tour",
	is_active = true,
	image = defaultImage,
	onEdit,
	onOpenBookings,
}) {
	const formattedPrice =
		typeof price === "number"
			? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
            }).format(price)
			: price;

	return (
		<Card className="border-dark-subtle rounded-0">
			<Card.Body className="p-0">
				<Row className="g-0 align-items-stretch">
					<Col
						xs={12}
						md={3}
						className="border-end border-dark-subtle d-flex align-items-stretch bg-light p-0"
					>
						<div className="w-100 h-100">
							<Image
								src={image || defaultImage}
								alt={name}
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						</div>
					</Col>

					<Col
						xs={12}
						md={6}
						className="border-end border-dark-subtle p-3 p-md-4 d-flex flex-column justify-content-between"
					>
						<div className="d-flex justify-content-between align-items-start gap-2 mb-2">
							<h2 className="mb-0 fw-semibold">{name}</h2>
							<Badge bg={is_active ? "success" : "secondary"}>
								{is_active ? "Đang hoạt động" : "Tạm dừng"}
							</Badge>
						</div>

						<div className="mb-2 text-muted">{description || "Không có mô tả"}</div>

						<div className="d-flex flex-wrap gap-3 mb-2">
							<span>Gia: {formattedPrice}</span>
							<span>So luong: {quantity}</span>
						</div>

						<div className="d-flex flex-wrap gap-3 small text-secondary">
							<span>Service ID: {id ?? "-"}</span>
							<span>Provider ID: {provider_id ?? "-"}</span>
							<span>Loai DV ID: {type_of_service_id ?? "-"}</span>
							<span>Loai DV: {type_of_service_name}</span>
						</div>
					</Col>

					<Col
						xs={12}
						md={3}
						className="p-3 p-md-4 d-flex flex-column justify-content-center"
					>
						<div className="d-flex flex-column align-items-md-end align-items-start gap-3">
							<Button variant="outline-primary" onClick={onEdit}>
								Chinh sua
							</Button>
							<Button variant="primary" onClick={onOpenBookings}>
								Danh sach booking
							</Button>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}

export default CardServiceItem;
