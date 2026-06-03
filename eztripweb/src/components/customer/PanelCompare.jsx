import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Badge, Button, Card, Col, Form, Image, InputGroup, Row, Stack, Spinner } from "react-bootstrap";
import ModalResultCompare from "@components/customer/ModalResultCompare";
import { getAccommodations, getTourisms } from "@services/customerService";
import defaultAccommodationImage from "@assets/images/default_accommodation_item.jpg";
import defaultTourImage from "@assets/images/default_tour_item.jpg";
import { formatCurrency } from "@utils/formatters";
import useDebounce from "@hooks/useDebounce";
import useInfiniteScrollList from "@hooks/useInfiniteScrollList";

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
	const [selectedServices, setSelectedServices] = useState([]);
	const [localError, setLocalError] = useState("");
	const [showResultModal, setShowResultModal] = useState(false);

	const currentServiceId = currentService?.baseInfo?.id ?? currentService?.id;
	const config = SERVICE_CONFIG[serviceType] ?? SERVICE_CONFIG.accommodation;

	const selectedIds = useMemo(
		() => selectedServices.map((service) => service?.baseInfo?.id ?? service?.id),
		[selectedServices],
	);

    const fetchPage = async (pageParam) => {
        const response = await config.loadList({ 
            name: debouncedQueryInput.trim(),
            page: pageParam,
            size: 5
        });
        return Array.isArray(response) ? response : response?.content ?? [];
    };

    const {
        items: rawItems,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        error: fetchError
    } = useInfiniteScrollList({
        queryKey: ["compare-services", serviceType, debouncedQueryInput],
        fetchPage
    });

    const services = useMemo(() => {
        return rawItems.filter(service => {
            const serviceId = service?.baseInfo?.id ?? service?.id;
            return !currentServiceId || serviceId !== currentServiceId;
        });
    }, [rawItems, currentServiceId]);

    const observer = useRef();
    const lastElementRef = useCallback((node) => {
        if (loadingMore) return;
        
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loadingMore, hasMore, loadMore]);

	function handleToggleSelect(service) {
		const serviceId = service?.baseInfo?.id ?? service?.id;

		if (!serviceId || serviceId === currentServiceId) return;

		setSelectedServices((currentSelected) => {
			const existingIndex = currentSelected.findIndex((item) => (item?.baseInfo?.id ?? item?.id) === serviceId);

			if (existingIndex >= 0) {
                setLocalError("");
				return currentSelected.filter((item) => (item?.baseInfo?.id ?? item?.id) !== serviceId);
			}

			if (currentSelected.length >= 2) {
				setLocalError("Chỉ được chọn tối đa 2 dịch vụ để so sánh.");
				return currentSelected;
			}

			setLocalError("");
			return [...currentSelected, service];
		});
	}

	function handleCompare() {
		if (selectedServices.length === 0) {
			setLocalError("Hãy chọn ít nhất 1 dịch vụ để so sánh.");
			return;
		}
		setShowResultModal(true);
	}

	function handleRemoveSelected(serviceId) {
		setSelectedServices((currentSelected) => {
            setLocalError("");
			return currentSelected.filter((item) => (item?.baseInfo?.id ?? item?.id) !== serviceId);
        });
	}

    const displayError = localError || (fetchError ? `Không thể tải danh sách ${config.label}.` : "");

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

				{selectedServices.length > 0 && (
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
				)}

				{displayError && <div className="alert alert-warning py-2 mb-0">{displayError}</div>}

				<div className="flex-grow-1 overflow-auto pe-1" style={{ maxHeight: 420 }}>
					<Stack gap={3}>
						{services.length > 0 ? (
							services.map((service, index) => {
								const serviceInfo = getServiceInfo(service);
								const serviceId = serviceInfo.id ?? service?.id;
								const isSelected = selectedIds.includes(serviceId);
								const canSelect = isSelected || selectedServices.length < 2;
                                
                                const isLastElement = services.length === index + 1;

								return (
                                    <Card
                                        key={serviceId}
                                        ref={isLastElement ? lastElementRef : null}
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
												{serviceInfo.companyName && (
													<div className="text-body-secondary small mb-1">{serviceInfo.companyName}</div>
												)}
												{service.location && (
													<div className="text-body-secondary small mb-1">{service.location}</div>
												)}
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

                        {loadingMore && (
                            <div className="d-flex justify-content-center py-2">
                                <Spinner animation="border" variant="primary" size="sm" />
                            </div>
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