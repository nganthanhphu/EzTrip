import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Image, InputGroup, Row, Stack } from "react-bootstrap";
import ModalResultCompare from "@components/customer/ModalResultCompare";
import { getAccommodations, getTourisms } from "@services/customerService";
import defaultAccommodationImage from "@assets/images/default_accommodation_item.jpg";
import defaultTourImage from "@assets/images/default_tour_item.jpg";
import { formatCurrency } from "@utils/formatters";
import useDebounce from "@hooks/useDebounce";

const SERVICE_CONFIG = {
	accommodation: {
		label: "chỗ nghỉ",
		loadList: getAccommodations,
		defaultImage: defaultAccommodationImage,
	},
	tourism: {
		label: "tour",
		loadList: getTourisms,
		defaultImage: defaultTourImage,
	},
};

function getServiceInfo(service) {
	return service?.baseInfo ?? service ?? {};
}

function PanelCompare({ currentService, serviceType = "accommodation" }) {
	const [queryInput, setQueryInput] = useState("");
	const debouncedQueryInput = useDebounce(queryInput);
	const [services, setServices] = useState([]);
	const [selectedServices, setSelectedServices] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showResultModal, setShowResultModal] = useState(false);

	const currentServiceId = currentService?.baseInfo?.id ?? currentService?.id;
	const config = SERVICE_CONFIG[serviceType] ?? SERVICE_CONFIG.accommodation;

	const selectedIds = useMemo(
		() => selectedServices.map((service) => service?.baseInfo?.id ?? service?.id),
		[selectedServices],
	);

	useEffect(() => {
		let isMounted = true;

		async function loadServices() {
			setLoading(true);
			setError("");

			try {
				const response = await config.loadList({ name: debouncedQueryInput.trim() });
				const nextServices = Array.isArray(response) ? response : response?.content ?? [];

				if (!isMounted) {
					return;
				}

				setServices(
					nextServices.filter((service) => {
						const serviceId = service?.baseInfo?.id ?? service?.id;
						return !currentServiceId || serviceId !== currentServiceId;
					}),
				);
			} catch (fetchError) {
				if (isMounted) {
					setError(`Không thể tải danh sách ${config.label}.`);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadServices();

		return () => {
			isMounted = false;
		};
	}, [config, currentServiceId, debouncedQueryInput]);

	function handleToggleSelect(service) {
		const serviceId = service?.baseInfo?.id ?? service?.id;

		if (!serviceId || serviceId === currentServiceId) {
			return;
		}

		setSelectedServices((currentSelected) => {
			const existingIndex = currentSelected.findIndex((item) => (item?.baseInfo?.id ?? item?.id) === serviceId);

			if (existingIndex >= 0) {
				return currentSelected.filter((item) => (item?.baseInfo?.id ?? item?.id) !== serviceId);
			}

			if (currentSelected.length >= 2) {
				setError("Chỉ được chọn tối đa 2 dịch vụ để so sánh.");
				return currentSelected;
			}

			setError("");
			return [...currentSelected, service];
		});
	}

	function handleCompare() {
		if (selectedServices.length === 0) {
			setError("Hãy chọn ít nhất 1 dịch vụ để so sánh.");
			return;
		}

		setShowResultModal(true);
	}

	function handleRemoveSelected(serviceId) {
		setSelectedServices((currentSelected) =>
			currentSelected.filter((item) => (item?.baseInfo?.id ?? item?.id) !== serviceId),
		);
	}

	return (
		<Card className="h-100 shadow-sm">
			<Card.Header className="bg-white fw-semibold">So sánh ngay {config.label} khác</Card.Header>
			<Card.Body className="d-flex flex-column gap-3">
				<Form>
					<InputGroup>
						<Form.Control
							type="search"
							placeholder={`Tìm ${config.label} theo tên`}
							value={queryInput}
							onChange={(event) => setQueryInput(event.target.value)}
						/>
					</InputGroup>
				</Form>

				{selectedServices.length > 0 ? (
					<div className="d-flex flex-wrap gap-2">
						{selectedServices.map((service) => {
							const serviceInfo = getServiceInfo(service);
							const serviceId = serviceInfo.id ?? service?.id;

							return (
								<Badge
									key={serviceId}
									bg="primary"
									className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-2"
								>
									<span>{serviceInfo.name}</span>
									<Button
										variant="link"
										size="sm"
										className="p-0 text-white text-decoration-none"
										onClick={() => handleRemoveSelected(serviceId)}
									>
										Hủy
									</Button>
								</Badge>
							);
						})}
					</div>
				) : null}

				{error ? <div className="alert alert-warning py-2 mb-0">{error}</div> : null}

				<div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: 420 }}>
					<Stack gap={3}>
						{services.length > 0 ? (
							services.map((service) => {
								const serviceInfo = getServiceInfo(service);
								const serviceId = serviceInfo.id ?? service?.id;
								const isSelected = selectedIds.includes(serviceId);
								const canSelect = isSelected || selectedServices.length < 2;

								return (
                                    <Card
                                        key={serviceId}
                                        body
                                        className={`border ${isSelected ? "border-primary" : ""}`}
                                    >
										<Row className="g-3">
											<Col xs={4} md={4} lg={4}>
												<div className="ratio ratio-4x3 bg-body-secondary rounded overflow-hidden">
													<Image
														src={serviceInfo.image || config.defaultImage}
														alt={serviceInfo.name}
														className="w-100 h-100 object-fit-cover"
													/>
												</div>
											</Col>

											<Col xs={8} md={8} lg={8}>
												<h5 className="mb-1 fw-semibold">{serviceInfo.name}</h5>
												{serviceInfo.companyName ? (
													<div className="text-body-secondary small mb-1">{serviceInfo.companyName}</div>
												) : null}
												{service.location ? (
													<div className="text-body-secondary small mb-1">{service.location}</div>
												) : null}
												<div className="small text-body-secondary">{formatCurrency(serviceInfo.price)}</div>
											</Col>
										</Row>

										<Row className="g-3 mt-2">
											<Col xs={12} className="d-grid">
												<Button
													variant={isSelected ? "outline-danger" : "primary"}
													onClick={() => handleToggleSelect(service)}
													disabled={!canSelect && !isSelected}
													className="w-100 w-md-auto"
												>
													{isSelected ? "Hủy chọn" : "So sánh"}
												</Button>
											</Col>
										</Row>
                                    </Card>
                                );
							})
						) : loading ? (
							<div className="text-body-secondary">Đang tải danh sách...</div>
						) : (
							<div className="text-body-secondary">Không tìm thấy dịch vụ phù hợp.</div>
						)}
					</Stack>
				</div>

				<div className="d-grid pt-2 border-top">
					<Button variant="primary" size="lg" onClick={handleCompare} disabled={selectedServices.length === 0}>
						So sánh ngay
					</Button>
				</div>
			</Card.Body>

			<ModalResultCompare
				show={showResultModal}
				onHide={() => setShowResultModal(false)}
				currentService={currentService}
				selectedServices={selectedServices}
				serviceType={serviceType}
			/>
		</Card>
	);
}

export default PanelCompare;
