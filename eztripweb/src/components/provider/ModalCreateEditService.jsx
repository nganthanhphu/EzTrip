import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MySpinner from "@components/common/MySpinner";
import { useLookupTables } from "@contexts/LookupTablesContext";
import { useAuth } from "@hooks/useAuth";
import { validateRequiredFields } from "@utils/validators";
import providerService from "@services/providerService";
import { useQueryClient } from "@tanstack/react-query";

const EMPTY_FORM = {
    name: "", description: "", price: "", quantity: "",
    quantityOfBed: "", area: "", location: "",
    arrivalLocation: "", departureLocation: "", arrivalTime: "", departureTime: "",
    typeOfTransportation: "", tourDuration: "",
};

const sameSelectedFile = (oldFile, newFile) => oldFile?.name === newFile?.name && oldFile?.size === newFile?.size && oldFile?.lastModified === newFile?.lastModified;
const getImageId = (img) => String(img?.id || "").trim();
const getImageUrl = (img) => img?.url || "";

export default function ModalCreateEditService({ show = true, onHide, onSuccess, service, serviceId }) {
    const isEditMode = Boolean(serviceId || service);
    const { currentUser, loading: authLoading } = useAuth();
    const { lookupTables } = useLookupTables();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const queryClient = useQueryClient();

    const providerType = currentUser?.providerProfile?.typeOfProvider;

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
                if (!providerType || providerType < 1 || providerType > 3) {
                    throw new Error("Không nhận diện được phân loại của nhà cung cấp hợp lệ.");
                }

                if (serviceId) {
                    let responseData;
                    if (providerType === 1) {
                        responseData = await providerService.getTourismById(serviceId);
                    } else if (providerType === 2) {
                        responseData = await providerService.getAccommodationById(serviceId);
                    } else if (providerType === 3) {
                        responseData = await providerService.getTransportationById(serviceId);
                    }

                    if (!responseData) throw new Error("Không tìm thấy dịch vụ cần chỉnh sửa.");
                    
                    if (!cancelled) {
                        const baseInfo = responseData?.baseInfo || {};
                        const nextForm = {
                            ...EMPTY_FORM,
                            name: baseInfo.name || "",
                            description: baseInfo.description || "",
                            price: baseInfo.price ?? "",
                            quantity: baseInfo.quantity ?? "",
                        };

                        if (providerType === 1) {
                            nextForm.tourDuration = responseData.tourDuration ?? "";
                            nextForm.location = responseData.location ?? "";
                        } else if (providerType === 2) {
                            nextForm.quantityOfBed = responseData.quantityOfBed ?? "";
                            nextForm.area = responseData.area ?? "";
                            nextForm.location = responseData.location ?? "";
                        } else if (providerType === 3) {
                            nextForm.arrivalLocation = responseData.arrivalLocation ?? "";
                            nextForm.departureLocation = responseData.departureLocation ?? "";
                            nextForm.arrivalTime = responseData.arrivalTime ?? "";
                            nextForm.departureTime = responseData.departureTime ?? "";
                            nextForm.typeOfTransportation = responseData.typeOfTransportation ?? "";
                        }

                        setForm(nextForm);
                        setExistingImages(baseInfo.images || []);
                    }
                } else {
                    if (!cancelled) {
                        setForm({ ...EMPTY_FORM });
                    }
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
    }, [authLoading, navigate, onHide, providerType, serviceId, show, isEditMode]);

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
            await providerService.deleteImage(imageId);
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

        if (providerType === 1) {
            append("tourDuration", form.tourDuration);
            append("location", form.location.trim());
        } else if (providerType === 2) {
            append("quantityOfBed", form.quantityOfBed);
            append("area", form.area);
            append("location", form.location.trim());
        } else if (providerType === 3) {
            append("arrivalLocation", form.arrivalLocation);
            append("departureLocation", form.departureLocation.trim());
            append("arrivalTime", form.arrivalTime);
            append("departureTime", form.departureTime);
            append("typeOfTransportation", form.typeOfTransportation);
        }

        return payload;
    };

    const closeModal = () => onHide ? onHide() : navigate("/provider/services");

    const handleDeleteService = async () => {
        if (!serviceId || !window.confirm("Bạn có chắc muốn xóa dịch vụ này không?")) return;

        try {
            setDeletingService(true);
            setError("");
            
            if (providerType === 1) {
                await providerService.deleteTourism(serviceId);
            } else if (providerType === 2) {
                await providerService.deleteAccommodation(serviceId);
            } else if (providerType === 3) {
                await providerService.deleteTransportation(serviceId);
            }

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
        
        let requiredFields = [
            { name: "name", label: "name" }, 
            { name: "description", label: "description" },
            { name: "price", label: "price" }, 
            { name: "quantity", label: "quantity" },
        ];

        if (providerType === 1) {
            requiredFields.push({ name: "tourDuration", label: "Thời lượng" }, { name: "location", label: "Địa điểm" });
        } else if (providerType === 2) {
            requiredFields.push({ name: "quantityOfBed", label: "Số giường" }, { name: "area", label: "Diện tích" }, { name: "location", label: "Vị trí" });
        } else if (providerType === 3) {
            requiredFields.push({ name: "arrivalLocation", label: "Điểm đến" }, { name: "departureLocation", label: "Khởi hành" }, { name: "arrivalTime", label: "Giờ đến" }, { name: "departureTime", label: "Giờ đi" }, { name: "typeOfTransportation", label: "Loại phương tiện" });
        }

        const requiredValidation = validateRequiredFields(form, requiredFields, { messagePrefix: "Vui lòng nhập", messageSuffix: "." });

        if (!requiredValidation.valid) return setError(requiredValidation.message);

        try {
            setError("");
            setSubmitting(true);
            const payload = buildPayload();
            let response;

            if (providerType === 1) {
                response = isEditMode ? await providerService.updateTourism(serviceId, payload) : await providerService.createTourism(payload);
            } else if (providerType === 2) {
                response = isEditMode ? await providerService.updateAccommodation(serviceId, payload) : await providerService.createAccommodation(payload);
            } else if (providerType === 3) {
                response = isEditMode ? await providerService.updateTransportation(serviceId, payload) : await providerService.createTransportation(payload);
            }

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

    let modalTitle = "";
    let submitLabel = "";
    let serviceTypeName = "";

    if (providerType === 1) {
        modalTitle = isEditMode ? "Chỉnh sửa dịch vụ tour" : "Tạo tour";
        submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo tour";
        serviceTypeName = "Tour";
    } else if (providerType === 2) {
        modalTitle = isEditMode ? "Chỉnh sửa dịch vụ lưu trú" : "Tạo lưu trú";
        submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo lưu trú";
        serviceTypeName = "Lưu trú";
    } else if (providerType === 3) {
        modalTitle = isEditMode ? "Chỉnh sửa dịch vụ vận chuyển" : "Tạo vận chuyển";
        submitLabel = isEditMode ? "Lưu thay đổi" : "Tạo vận chuyển";
        serviceTypeName = "Vận chuyển";
    }

    return (
        <Modal show={show} onHide={closeModal} centered size="xl" scrollable backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
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
                                                <Form.Control value={serviceTypeName} readOnly disabled />
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

                                        {providerType === 1 && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="tourDuration">
                                                        <Form.Label>Thời lượng (ngày)</Form.Label>
                                                        <Form.Control name="tourDuration" type="number" min="1" step="1" value={form.tourDuration} onChange={handleChange} placeholder="Thời lượng" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={12}>
                                                    <Form.Group controlId="location">
                                                        <Form.Label>Địa điểm</Form.Label>
                                                        <Form.Control name="location" type="text" value={form.location} onChange={handleChange} placeholder="Địa điểm" />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}

                                        {providerType === 2 && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="quantityOfBed">
                                                        <Form.Label>Số giường</Form.Label>
                                                        <Form.Control name="quantityOfBed" type="number" min="1" step="1" value={form.quantityOfBed} onChange={handleChange} placeholder="Số giường" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="area">
                                                        <Form.Label>Diện tích (m²)</Form.Label>
                                                        <Form.Control name="area" type="number" min="0" step="0.1" value={form.area} onChange={handleChange} placeholder="Diện tích (m²)" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={12}>
                                                    <Form.Group controlId="location">
                                                        <Form.Label>Vị trí</Form.Label>
                                                        <Form.Control name="location" type="text" value={form.location} onChange={handleChange} placeholder="Vị trí" />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}

                                        {providerType === 3 && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="departureLocation">
                                                        <Form.Label>Điểm khởi hành</Form.Label>
                                                        <Form.Control name="departureLocation" type="text" value={form.departureLocation} onChange={handleChange} placeholder="Điểm khởi hành" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="arrivalLocation">
                                                        <Form.Label>Điểm đến</Form.Label>
                                                        <Form.Control name="arrivalLocation" type="text" value={form.arrivalLocation} onChange={handleChange} placeholder="Điểm đến" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="departureTime">
                                                        <Form.Label>Giờ khởi hành</Form.Label>
                                                        <Form.Control name="departureTime" type="number" min="0" max="23" step="1" value={form.departureTime} onChange={handleChange} placeholder="Giờ khởi hành" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="arrivalTime">
                                                        <Form.Label>Giờ đến</Form.Label>
                                                        <Form.Control name="arrivalTime" type="number" min="0" max="23" step="1" value={form.arrivalTime} onChange={handleChange} placeholder="Giờ đến" />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="typeOfTransportation">
                                                        <Form.Label>Loại phương tiện</Form.Label>
                                                        <Form.Select name="typeOfTransportation" value={form.typeOfTransportation} onChange={handleChange}>
                                                            <option value="">Chọn loại phương tiện</option>
                                                            {(typeOfTransportationOptions || []).map((opt) => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}
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
                        {submitting ? <MySpinner /> : submitLabel}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}