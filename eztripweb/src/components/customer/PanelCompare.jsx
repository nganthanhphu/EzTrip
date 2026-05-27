import { useMemo, useState } from "react";
import { Button, Card, Col, Form, Image, InputGroup, Row, Stack } from "react-bootstrap";
import defaultAccommodationImage from "../../assets/images/default_accommodation_item.jpg";

function PanelCompare({ services = [] }) {
	const [query, setQuery] = useState("");

	const filteredServices = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		if (!normalizedQuery) {
			return services;
		}

		return services.filter((service) => {
			const haystack = [service.name, service.providerName, service.location]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();

			return haystack.includes(normalizedQuery);
		});
	}, [query, services]);

	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">
				Thêm dịch vụ ? So sánh ngay
			</Card.Header>
			<Card.Body>
				<Form className="mb-3" onSubmit={(event) => event.preventDefault()}>
					<InputGroup>
						<Form.Control
							type="search"
							placeholder="Tìm dịch vụ cùng loại khác"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Button variant="outline-primary" type="submit">
							Tìm
						</Button>
					</InputGroup>
				</Form>

				<Stack gap={3}>
					{filteredServices.length > 0 ? (
						filteredServices.map((service, index) => (
							<Card key={`${service.name}-${index}`} body className="border">
								<Row className="g-3 align-items-center">
									<Col xs={4} md={5} lg={4}>
										<div className="ratio ratio-4x3 bg-body-secondary rounded overflow-hidden">
											<Image
												src={service.imageUrl || defaultAccommodationImage}
												alt={service.name}
												className="w-100 h-100 object-fit-cover"
											/>
										</div>
									</Col>
									<Col xs={8} md={7} lg={8}>
										<div className="fw-semibold mb-1">{service.name}</div>
										<div className="text-body-secondary small">
											{service.providerName}
										</div>
										{service.location ? (
											<div className="small mt-1">{service.location}</div>
										) : null}
									</Col>
								</Row>
							</Card>
						))
					) : (
						<div className="text-body-secondary">Không tìm thấy dịch vụ phù hợp.</div>
					)}
				</Stack>
			</Card.Body>
		</Card>
	);
}

export default PanelCompare;
