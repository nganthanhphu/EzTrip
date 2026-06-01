import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MySpinner from "@components/common/MySpinner";
import { useLookupTables } from "@contexts/LookupTablesContext";
import { useAuth } from "@hooks/useAuth";
import { validateRequiredFields } from "@utils/validators";
import {
    deleteImage,
    deleteServiceByType,
    createAccommodation,
    createTourism,
    createTransportation,
    getServiceById,
    updateServiceByType,
} from "@services/providerService";
import { useQueryClient } from "@tanstack/react-query";

const SERVICE_TYPES = {
    ACCOMMODATION: "ACCOMMODATION",
    TRANSPORTATION: "TRANSPORTATION",
    TOURISM: "TOURISM"
};

const SERVICE_TYPE_OPTIONS = [
    { value: SERVICE_TYPES.ACCOMMODATION, label: "Lưu trú" },
    { value: SERVICE_TYPES.TRANSPORTATION, label: "Vận chuyển" },
    { value: SERVICE_TYPES.TOURISM, label: "Tour" },
];

const EMPTY_FORM = {
    name: "", description: "", price: "", quantity: "",
    quantityOfBed: "", area: "", location: "",
    arrivalLocation: "", departureLocation: "", arrivalTime: "", departureTime: "",
    typeOfTransportation: "", tourDuration: "",
};

const PROVIDER_TYPE_MAP = {
    1: SERVICE_TYPES.TOURISM,
    2: SERVICE_TYPES.ACCOMMODATION,
    3: SERVICE_TYPES.TRANSPORTATION
};

const CREATORS_MAP = {
    [SERVICE_TYPES.ACCOMMODATION]: createAccommodation,
    [SERVICE_TYPES.TRANSPORTATION]: createTransportation,
    [SERVICE_TYPES.TOURISM]: createTourism,
};

const resolveServiceTypeLabel = (type) => SERVICE_TYPE_OPTIONS.find((opt) => opt.value === type)?.label || "Dịch vụ";

const inferServiceType = (service) => {
    if (!service) return "";
    if (service.quantityOfBed !== undefined || service.area !== undefined) return SERVICE_TYPES.ACCOMMODATION;
    if (service.arrivalLocation !== undefined || service.departureLocation !== undefined || service.typeOfTransportation !== undefined) return SERVICE_TYPES.TRANSPORTATION;
    if (service.tourDuration !== undefined) return SERVICE_TYPES.TOURISM;
    return "";
};

const buildFormFromService = (service, serviceType) => {
    const baseInfo = service?.baseInfo || {};
    const nextForm = {
        ...EMPTY_FORM,
        name: baseInfo.name || "",
        description: baseInfo.description || "",
        price: baseInfo.price ?? "",
        quantity: baseInfo.quantity ?? "",
    };

    const typeSpecificKeys = {
        [SERVICE_TYPES.TRANSPORTATION]: ["arrivalLocation", "departureLocation", "arrivalTime", "departureTime", "typeOfTransportation"],
        [SERVICE_TYPES.TOURISM]: ["tourDuration", "location"],
        [SERVICE_TYPES.ACCOMMODATION]: ["quantityOfBed", "area", "location"]
    };

    (typeSpecificKeys[serviceType] || typeSpecificKeys[SERVICE_TYPES.ACCOMMODATION]).forEach(key => {
        nextForm[key] = service?.[key] ?? "";
    });

    return nextForm;
};

const sameSelectedFile = (left, right) => left?.name === right?.name && left?.size === right?.size && left?.lastModified === right?.lastModified;

const getImageId = (img) => String(img?.id || "").trim();
const getImageUrl = (img) => img?.url || "";

const getServiceFactory = (type, transOptions, isEdit) => {
    const mode = isEdit ? "Chỉnh sửa" : "Tạo";
    const configs = {
        [SERVICE_TYPES.ACCOMMODATION]: {
            title: `${mode} dịch vụ lưu trú`, submitLabel: isEdit ? "Lưu thay đổi" : "Tạo lưu trú",
            fields: [
                { name: "quantityOfBed", label: "Số giường", type: "number", min: 1, step: 1, required: true },
                { name: "area", label: "Diện tích (m²)", type: "number", min: 0, step: "0.1", required: true },
                { name: "location", label: "Vị trí", type: "text", required: true },
            ],
        },
        [SERVICE_TYPES.TRANSPORTATION]: {
            title: `${mode} dịch vụ vận chuyển`, submitLabel: isEdit ? "Lưu thay đổi" : "Tạo vận chuyển",
            fields: [
                { name: "arrivalLocation", label: "Điểm đến", type: "text", required: true },
                { name: "departureLocation", label: "Điểm khởi hành", type: "text", required: true },
                { name: "arrivalTime", label: "Giờ đến", type: "number", min: 0, max: 23, step: 1, required: true },
                { name: "departureTime", label: "Giờ khởi hành", type: "number", min: 0, max: 23, step: 1, required: true },
                { name: "typeOfTransportation", label: "Loại phương tiện", type: "select", required: true, options: transOptions },
            ],
        },
        [SERVICE_TYPES.TOURISM]: {
            title: `${mode} dịch vụ tour`, submitLabel: isEdit ? "Lưu thay đổi" : "Tạo tour",
            fields: [
                { name: "tourDuration", label: "Thời lượng (ngày)", type: "number", min: 1, step: 1, required: true },
                { name: "location", label: "Địa điểm", type: "text", required: true },
            ],
        },
    };
    return configs[type] || configs[SERVICE_TYPES.ACCOMMODATION];
};

export default function ModalCreateEditService({ show = true, onHide, onSuccess, service, serviceId }) {
    const isEditMode = Boolean(serviceId || service);
    const { currentUser, loading: authLoading } = useAuth();
    const { lookupTables } = useLookupTables();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const queryClient = useQueryClient();

    const providerTypeId = currentUser?.providerProfile?.typeOfProvider;

    const [serviceType, setServiceType] = useState("");
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletingImageId, setDeletingImageId] = useState("");
    const [deletingService, setDeletingService] = useState(false);

    const typeOfTransportationOptions = useMemo(() => lookupTables?.typeOfTransportations || [], [lookupTables]);

    const serviceFactory = useMemo(
        () => getServiceFactory(serviceType, typeOfTransportationOptions, isEditMode),
        [serviceType, typeOfTransportationOptions, isEditMode]
    );

    useEffect(() => {
        if (!selectedImages.length) {
            setSelectedImagePreviews([]);
            return;
        }
        const previewItems = selectedImages.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));
        setSelectedImagePreviews(previewItems);
        return () => previewItems.forEach(({ previewUrl }) => URL.revokeObjectURL(previewUrl));
    }, [selectedImages]);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            if (authLoading || !show) return;

            setInitializing(true);
            setError("");
            setSelectedImages([]);
            setExistingImages([]);

            try {
                if (service && !serviceId) {
                    const nextType = service.type || inferServiceType(service);
                    if (!nextType) throw new Error("Không xác định được loại dịch vụ.");
                    if (!cancelled) {
                        setServiceType(nextType);
                        setForm(buildFormFromService(service, nextType));
                        setExistingImages(service?.baseInfo?.images || []);
                    }
                    return;
                }

                if (serviceId) {
                    const response = await getServiceById(serviceId);
                    if (!response?.service) throw new Error("Không tìm thấy dịch vụ cần chỉnh sửa.");
                    
                    const nextType = response.type || inferServiceType(response.service);
                    if (!nextType) throw new Error("Không xác định được loại dịch vụ.");
                    
                    if (!cancelled) {
                        setServiceType(nextType);
                        setForm(buildFormFromService(response.service, nextType));
                        setExistingImages(response.service?.baseInfo?.images || []);
                    }
                    return;
                }

                const nextType = PROVIDER_TYPE_MAP[Number(providerTypeId)] || "";
                if (!cancelled) {
                    setServiceType(nextType);
                    setForm({ ...EMPTY_FORM });
                    if (!nextType) setError("Không nhận diện được phân loại của nhà cung cấp. Vui lòng kiểm tra lại tài khoản.");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Không thể tải dữ liệu dịch vụ.");
                    if (!isEditMode && onHide) onHide();
                    else if (!isEditMode) navigate("/provider/services", { replace: true });
                }
            } finally {
                if (!cancelled) setInitializing(false);
            }
        }

        bootstrap();
        return () => { cancelled = true; };
    }, [authLoading, navigate, onHide, providerTypeId, serviceId, service, show, isEditMode]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        setSelectedImages((curr) => {
            const nextFiles = [...curr];
            for (const file of files) {
                if (!nextFiles.some((cf) => sameSelectedFile(cf, file))) nextFiles.push(file);
            }
            return nextFiles;
        });
        e.target.value = "";
    };

    const handleChange = (e) => setForm((curr) => ({ ...curr, [e.target.name]: e.target.value }));

    const removeSelectedImage = (indexToRemove) => {
        setSelectedImages((curr) => curr.filter((_, idx) => idx !== indexToRemove));
    };

    const handleDeleteExistingImage = async (image) => {
        const imageId = getImageId(image);
        if (!imageId) return setError("Không xác định được ảnh cần xóa.");
        if (!window.confirm("Bạn có chắc muốn xóa ảnh này không?")) return;

        try {
            setDeletingImageId(imageId);
            setError("");
            await deleteImage(imageId);
            setExistingImages((curr) => curr.filter((img) => getImageId(img) !== imageId));
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Không thể xóa ảnh.");
        } finally {
            setDeletingImageId("");
        }
    };

    const buildPayload = () => {
        const payload = new FormData();
        const append = (key, value) => {
            if (value !== undefined && value !== null && value !== "") payload.append(key, value);
        };

        append("baseInfo.name", form.name.trim());
        append("baseInfo.description", form.description.trim());
        append("baseInfo.price", form.price);
        append("baseInfo.quantity", form.quantity);

        selectedImages.forEach((img) => payload.append("baseInfo.imgFiles", img));

        if (serviceType === SERVICE_TYPES.TRANSPORTATION) {
            append("arrivalLocation", form.arrivalLocation);
            append("departureLocation", form.departureLocation.trim());
            append("arrivalTime", form.arrivalTime);
            append("departureTime", form.departureTime);
            append("typeOfTransportation", form.typeOfTransportation);
        } else if (serviceType === SERVICE_TYPES.TOURISM) {
            append("tourDuration", form.tourDuration);
            append("location", form.location.trim());
        } else {
            append("quantityOfBed", form.quantityOfBed);
            append("area", form.area);
            append("location", form.location.trim());
        }

        return payload;
    };

    const closeModal = () => onHide ? onHide() : navigate("/provider/services");

    const handleDeleteService = async () => {
        if (!serviceId || !window.confirm("Bạn có chắc muốn xóa dịch vụ này không?")) return;

        try {
            setDeletingService(true);
            setError("");
            await deleteServiceByType(serviceType, serviceId);
            queryClient.invalidateQueries({ queryKey: ["provider-services"] });
            onSuccess ? onSuccess() : closeModal();
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || "Không thể xóa dịch vụ.");
        } finally {
            setDeletingService(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requiredValidation = validateRequiredFields(
            form,
            [
                { name: "name", label: "name" }, { name: "description", label: "description" },
                { name: "price", label: "price" }, { name: "quantity", label: "quantity" },
                ...serviceFactory.fields.filter((f) => f.required),
            ],
            { messagePrefix: "Vui lòng nhập", messageSuffix: "." }
        );

        if (!requiredValidation.valid) return setError(requiredValidation.message);

        try {
            const creator = isEditMode ? (payload) => updateServiceByType(serviceType, serviceId, payload) : CREATORS_MAP[serviceType];
            if (!creator) return setError("Loại dịch vụ không hợp lệ.");

            setError("");
            setSubmitting(true);

            const response = await creator(buildPayload());
            if (response?.status >= 200 && response?.status < 300) {
                queryClient.invalidateQueries({ queryKey: ["provider-services"] });
                onSuccess ? onSuccess() : closeModal();
                return;
            }
            setError("Hệ thống không phản hồi đúng mong đợi.");
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data?.error || (isEditMode ? "Không thể cập nhật dịch vụ." : "Không thể tạo dịch vụ."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={closeModal} centered size="xl" scrollable backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{serviceFactory.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4 p-md-5">
                {error && <Alert variant="danger">{error}</Alert>}

                {authLoading || initializing ? (
                    <div className="py-5 d-flex justify-content-center"><MySpinner /></div>
                ) : (
                    <Card className="border border-dark-subtle shadow-sm">
                        <Card.Body className="p-0">
                            <Form id="provider-service-form" onSubmit={handleSubmit}>
                                <div className="d-flex flex-column gap-3 p-3 p-md-4">
                                    
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Loại dịch vụ</Form.Label>
                                                <Form.Control value={resolveServiceTypeLabel(serviceType)} readOnly disabled />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="name">
                                                <Form.Label>Tên dịch vụ</Form.Label>
                                                <Form.Control name="name" type="text" value={form.name} onChange={handleChange} placeholder="Nhập tên dịch vụ" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="description">
                                                <Form.Label>Mô tả</Form.Label>
                                                <Form.Control name="description" as="textarea" rows={4} value={form.description} onChange={handleChange} placeholder="Mô tả ngắn gọn dịch vụ" />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="quantity">
                                                <Form.Label>Số lượng</Form.Label>
                                                <Form.Control name="quantity" type="number" min="1" step="1" value={form.quantity} onChange={handleChange} placeholder="Nhập số lượng" />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="price">
                                                <Form.Label>Đơn giá</Form.Label>
                                                <Form.Control name="price" type="number" min="0" step="1000" value={form.price} onChange={handleChange} placeholder="Nhập giá" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                                                <Form.Label className="mb-0">Hình ảnh</Form.Label>
                                                <div className="text-muted small">{existingImages.length + selectedImagePreviews.length} ảnh</div>
                                            </div>
                                            
                                            <Form.Control ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="d-none" />
                                            {!existingImages.length && !selectedImagePreviews.length && <div className="text-muted small mb-2">Chưa có ảnh nào.</div>}

                                            <Row className="g-3">
                                                {/* Existing Images */}
                                                {existingImages.map((img, idx) => {
                                                    const id = getImageId(img);
                                                    return (
                                                        <Col xs={6} md={4} lg={3} key={id || idx}>
                                                            <div className="position-relative rounded-3 overflow-hidden border bg-light h-100">
                                                                <Image src={getImageUrl(img)} alt="Ảnh hiện có" className="w-100 h-100 object-fit-cover" style={{ minHeight: 140 }} />
                                                                <Button type="button" variant="dark" size="sm" className="position-absolute top-0 end-0 m-2 rounded-circle d-inline-flex align-items-center justify-content-center p-0" style={{ width: 30, height: 30 }} onClick={() => handleDeleteExistingImage(img)} disabled={deletingImageId === id}>×</Button>
                                                            </div>
                                                        </Col>
                                                    );
                                                })}

                                                {selectedImagePreviews.map((preview, idx) => (
                                                    <Col xs={6} md={4} lg={3} key={`${preview.file.name}-${idx}`}>
                                                        <div className="position-relative rounded-3 overflow-hidden border bg-light h-100">
                                                            <Image src={preview.previewUrl} alt={preview.file.name} className="w-100 h-100 object-fit-cover" style={{ minHeight: 140 }} />
                                                            <Button type="button" variant="dark" size="sm" className="position-absolute top-0 end-0 m-2 rounded-circle d-inline-flex align-items-center justify-content-center p-0" style={{ width: 30, height: 30 }} onClick={() => removeSelectedImage(idx)}>×</Button>
                                                        </div>
                                                    </Col>
                                                ))}

                                                <Col xs={6} md={4} lg={3}>
                                                    <Button type="button" variant="outline-secondary" className="w-100 h-100 rounded-3 d-flex flex-column align-items-center justify-content-center text-decoration-none" style={{ minHeight: 140, borderStyle: "dashed" }} onClick={() => imageInputRef.current?.click()}>
                                                        <span className="fs-1 lh-1">+</span>
                                                        <span className="small mt-2">Thêm ảnh</span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {serviceFactory.fields.map((field) => (
                                            <Col xs={12} md={field.name === "location" ? 12 : 6} key={field.name}>
                                                <Form.Group controlId={field.name}>
                                                    <Form.Label>{field.label}</Form.Label>
                                                    {field.type === "select" ? (
                                                        <Form.Select name={field.name} value={form[field.name]} onChange={handleChange}>
                                                            <option value="">Chọn {field.label.toLowerCase()}</option>
                                                            {(field.options || []).map((opt) => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </Form.Select>
                                                    ) : (
                                                        <Form.Control name={field.name} type={field.type} min={field.min} step={field.step} value={form[field.name]} onChange={handleChange} placeholder={field.label} />
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                )}
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between gap-2">
                <div>
                    {isEditMode && (
                        <Button type="button" variant="outline-danger" onClick={handleDeleteService} disabled={submitting || deletingService}>
                            {deletingService ? "Đang xóa..." : "Xóa dịch vụ"}
                        </Button>
                    )}
                </div>
                <div className="d-flex gap-2 ms-auto">
                    <Button type="button" variant="outline-secondary" onClick={closeModal} disabled={submitting || deletingService}>
                        Hủy
                    </Button>
                    <Button type="submit" form="provider-service-form" variant="primary" disabled={submitting || deletingService}>
                        {submitting ? <MySpinner /> : serviceFactory.submitLabel}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}