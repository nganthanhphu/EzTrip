import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { compareAccommodations, compareTourisms } from "@services/customerService";

function getServiceInfo(service) {
	return service?.baseInfo ?? service ?? {};
}

function ModalResultCompare({ show, onHide, currentService, selectedServices = [], serviceType}) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [result, setResult] = useState("");

	const currentServiceInfo = useMemo(() => getServiceInfo(currentService), [currentService]);
	const compareService = serviceType === "tourism" ? compareTourisms : compareAccommodations;
	const selectedServiceInfos = useMemo(() => selectedServices.map(getServiceInfo), [selectedServices]);

	useEffect(() => {
		if (!show) {
			return;
		}

		const currentServiceId = currentServiceInfo.id;
		const selectedIds = selectedServiceInfos.map((service) => service.id).filter(Boolean);

		if (!currentServiceId || selectedIds.length === 0) {
			setError("Thiếu dữ liệu để so sánh.");
			setResult("");
			return;
		}

		let isMounted = true;

		async function loadCompareResult() {
			setLoading(true);
			setError("");
			setResult("");

			try {
				const response = await compareService({
					svcId1: currentServiceId,
					svcId2: selectedIds[0],
					svcId3: selectedIds[1],
				});

				if (!isMounted) {
					return;
				}

				setResult(response?.result ?? response?.data?.result ?? JSON.stringify(response ?? {}, null, 2));
			} catch (compareError) {
				if (isMounted) {
					setError(compareError?.response?.data?.message || "Không thể tải kết quả so sánh.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadCompareResult();

		return () => {
			isMounted = false;
		};
	}, [compareService, currentServiceInfo.id, selectedServiceInfos, show]);

	const compareTitle = selectedServiceInfos
		.map((service) => service.name)
		.filter(Boolean)
		.join(" - ");

	return (
		<Modal show={show} onHide={onHide} centered size="xl" scrollable>
			<Modal.Header closeButton>
				<Modal.Title>Kết quả so sánh {serviceType === "tourism" ? "tour" : "chỗ nghỉ"} (Gemini)</Modal.Title>
			</Modal.Header>
			<Modal.Body className="p-4">
				<div className="mb-3">
					<div className="fw-semibold mb-2">{currentServiceInfo.name}</div>
					<div className="d-flex flex-wrap gap-2">
						<Badge bg="secondary">Dịch vụ gốc</Badge>
						<Badge bg="primary">{compareTitle || "Dịch vụ đã chọn"}</Badge>
					</div>
				</div>

				{loading ? (
					<div className="d-flex align-items-center gap-2 text-body-secondary py-5 justify-content-center">
						<Spinner animation="border" size="sm" />
						<span>Đang lấy kết quả so sánh...</span>
					</div>
				) : null}

				{error ? <div className="alert alert-danger py-2">{error}</div> : null}

				{!loading && !error ? (
					<div className="rounded-3 border bg-light p-3">
						<div className="small text-body-secondary mb-2">Kết quả trả phân tích từ Gemini</div>
						<div style={{ whiteSpace: "pre-wrap" }}>
							{result || "Chưa có dữ liệu so sánh."}
						</div>
					</div>
				) : null}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-secondary" onClick={onHide}>
					Đóng
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalResultCompare;
