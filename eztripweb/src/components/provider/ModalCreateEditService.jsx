import { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Button,
    Card,
    Col,
    Form,
    Image,
    Modal,
    Row,
} from "react-bootstrap";
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

const SERVICE_TYPE_OPTIONS = [
    { value: "ACCOMMODATION", label: "Lưu trú" },
    { value: "TRANSPORTATION", label: "Vận chuyển" },
    { value: "TOURISM", label: "Tour" },
];

const EMPTY_FORM = {
    name: "",
    description: "",
    price: "",
    quantity: "",
    quantityOfBed: "",
    area: "",
    location: "",
    arrivalLocation: "",
    departureLocation: "",
    arrivalTime: "",
    departureTime: "",
    typeOfTransportation: "",
    tourDuration: "",
};

function normalizeServiceType(value) {
    return String(value || "")
        .trim()
        .toUpperCase();
}

function resolveServiceTypeLabel(serviceType) {
    return (
        SERVICE_TYPE_OPTIONS.find((option) => option.value === serviceType)
            ?.label || "Dịch vụ"
    );
}

function resolveServiceTypeFromProviderType(providerTypeId) {
    switch (Number(providerTypeId)) {
        case 1:
            return "TOURISM";
        case 2:
            return "ACCOMMODATION";
        case 3:
            return "TRANSPORTATION";
        default:
            return "";
    }
}

function inferServiceType(service) {
    if (!service) {
        return "";
    }

    if (service.quantityOfBed !== undefined || service.area !== undefined) {
        return "ACCOMMODATION";
    }

    if (
        service.arrivalLocation !== undefined ||
        service.departureLocation !== undefined ||
        service.typeOfTransportation !== undefined
    ) {
        return "TRANSPORTATION";
    }

    if (service.tourDuration !== undefined) {
        return "TOURISM";
    }

    return "";
}

function buildEmptyForm() {
    return { ...EMPTY_FORM };
}

function buildFormFromService(service, serviceType) {
    const baseInfo = service?.baseInfo || {};
    const nextForm = {
        ...EMPTY_FORM,
        name: baseInfo.name || "",
        description: baseInfo.description || "",
        price: baseInfo.price ?? "",
        quantity: baseInfo.quantity ?? "",
    };

    switch (serviceType) {
        case "TRANSPORTATION":
            nextForm.arrivalLocation = service?.arrivalLocation || "";
            nextForm.departureLocation = service?.departureLocation || "";
            nextForm.arrivalTime = service?.arrivalTime ?? "";
            nextForm.departureTime = service?.departureTime ?? "";
            nextForm.typeOfTransportation = service?.typeOfTransportation ?? "";
            break;
        case "TOURISM":
            nextForm.tourDuration = service?.tourDuration ?? "";
            nextForm.location = service?.location || "";
            break;
        case "ACCOMMODATION":
        default:
            nextForm.quantityOfBed = service?.quantityOfBed ?? "";
            nextForm.area = service?.area ?? "";
            nextForm.location = service?.location || "";
            break;
    }

    return nextForm;
}

function sameSelectedFile(left, right) {
    return (
        left?.name === right?.name &&
        left?.size === right?.size &&
        left?.lastModified === right?.lastModified
    );
}

function createServiceFactory(
    serviceType,
    typeOfTransportationOptions,
    isEditMode,
) {
    const modeLabel = isEditMode ? "Chỉnh sửa" : "Tạo";

    const factories = {
        ACCOMMODATION: {
            title: `${modeLabel} dịch vụ lưu trú`,
            submitLabel: isEditMode ? "Lưu thay đổi" : "Tạo lưu trú",
            childFields: [
                {
                    name: "quantityOfBed",
                    label: "Số giường",
                    type: "number",
                    min: 1,
                    step: 1,
                    required: true,
                },
                {
                    name: "area",
                    label: "Diện tích (m²)",
                    type: "number",
                    min: 0,
                    step: "0.1",
                    required: true,
                },
                {
                    name: "location",
                    label: "Vị trí",
                    type: "text",
                    required: true,
                },
            ],
        },
        TRANSPORTATION: {
            title: `${modeLabel} dịch vụ vận chuyển`,
            submitLabel: isEditMode ? "Lưu thay đổi" : "Tạo vận chuyển",
            childFields: [
                {
                    name: "arrivalLocation",
                    label: "Điểm đến",
                    type: "text",
                    required: true,
                },
                {
                    name: "departureLocation",
                    label: "Điểm khởi hành",
                    type: "text",
                    required: true,
                },
                {
                    name: "arrivalTime",
                    label: "Giờ đến",
                    type: "number",
                    min: 0,
                    max: 23,
                    step: 1,
                    required: true,
                },
                {
                    name: "departureTime",
                    label: "Giờ khởi hành",
                    type: "number",
                    min: 0,
                    max: 23,
                    step: 1,
                    required: true,
                },
                {
                    name: "typeOfTransportation",
                    label: "Loại phương tiện",
                    type: "select",
                    required: true,
                    options: typeOfTransportationOptions,
                },
            ],
        },
        TOURISM: {
            title: `${modeLabel} dịch vụ tour`,
            submitLabel: isEditMode ? "Lưu thay đổi" : "Tạo tour",
            childFields: [
                {
                    name: "tourDuration",
                    label: "Thời lượng (ngày)",
                    type: "number",
                    min: 1,
                    step: 1,
                    required: true,
                },
                {
                    name: "location",
                    label: "Địa điểm",
                    type: "text",
                    required: true,
                },
            ],
        },
    };

    return factories[serviceType] || factories.ACCOMMODATION;
}

function appendField(formData, key, value) {
    if (value === undefined || value === null || value === "") {
        return;
    }
    formData.append(key, value);
}

function getServiceCreator(serviceType) {
    const creators = {
        ACCOMMODATION: createAccommodation,
        TRANSPORTATION: createTransportation,
        TOURISM: createTourism,
    };

    return creators[serviceType] || null;
}

function ModalCreateEditService({ show = true, onHide, service, serviceId }) {
    const isEditMode = Boolean(serviceId || service);
    const { currentUser, loading: authLoading } = useAuth();
    const { lookupTables } = useLookupTables();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);

    const providerTypeId = currentUser?.providerProfile?.typeOfProvider;

    const [serviceType, setServiceType] = useState("");
    const [form, setForm] = useState(buildEmptyForm);
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImagePreviews, setSelectedImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [deletingImageId, setDeletingImageId] = useState("");
    const [deletingService, setDeletingService] = useState(false);

    const typeOfTransportationOptions = useMemo(
        () => lookupTables?.typeOfTransportations || [],
        [lookupTables],
    );

    const serviceFactory = useMemo(
        () =>
            createServiceFactory(
                serviceType,
                typeOfTransportationOptions,
                isEditMode,
            ),
        [serviceType, typeOfTransportationOptions, isEditMode],
    );

    useEffect(() => {
        if (!selectedImages.length) {
            setSelectedImagePreviews([]);
            return undefined;
        }

        const previewItems = selectedImages.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
        }));

        setSelectedImagePreviews(previewItems);

        return () => {
            previewItems.forEach(({ previewUrl }) =>
                URL.revokeObjectURL(previewUrl),
            );
        };
    }, [selectedImages]);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            if (authLoading || !show) {
                return;
            }

            setInitializing(true);
            setError("");
            setSelectedImages([]);
            setExistingImages([]);

            try {
                if (service && !serviceId) {
                    const nextServiceType = normalizeServiceType(
                        service.type || inferServiceType(service),
                    );

                    if (!nextServiceType) {
                        throw new Error("Không xác định được loại dịch vụ.");
                    }

                    if (!cancelled) {
                        setServiceType(nextServiceType);
                        setForm(buildFormFromService(service, nextServiceType));
                        setExistingImages(service?.baseInfo?.images || []);
                    }

                    return;
                }

                if (serviceId) {
                    const response = await getServiceById(serviceId);

                    if (!response?.service) {
                        throw new Error(
                            "Không tìm thấy dịch vụ cần chỉnh sửa.",
                        );
                    }

                    const nextServiceType = normalizeServiceType(
                        response.type || inferServiceType(response.service),
                    );

                    if (!nextServiceType) {
                        throw new Error("Không xác định được loại dịch vụ.");
                    }

                    if (!cancelled) {
                        setServiceType(nextServiceType);
                        setForm(
                            buildFormFromService(
                                response.service,
                                nextServiceType,
                            ),
                        );
                        setExistingImages(
                            response.service?.baseInfo?.images || [],
                        );
                    }

                    return;
                }

                const nextServiceType = normalizeServiceType(
                    resolveServiceTypeFromProviderType(providerTypeId),
                );

                if (!nextServiceType) {
                    if (!cancelled) {
                        setServiceType("");
                        setForm(buildEmptyForm());
                        setExistingImages([]);
                        setError(
                            "Không nhận diện được phân loại của nhà cung cấp. Vui lòng kiểm tra lại tài khoản.",
                        );
                    }
                } else {
                    if (!cancelled) {
                        setServiceType(nextServiceType);
                        setForm(buildEmptyForm());
                        setExistingImages([]);
                    }
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(
                        loadError?.response?.data?.message ||
                            loadError?.response?.data?.error ||
                            loadError?.message ||
                            "Không thể tải dữ liệu dịch vụ.",
                    );

                    if (!isEditMode && onHide) {
                        onHide();
                    } else if (!isEditMode) {
                        navigate("/provider/services", { replace: true });
                    }
                }
            } finally {
                if (!cancelled) {
                    setInitializing(false);
                }
            }
        }

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, [
        authLoading,
        navigate,
        onHide,
        providerTypeId,
        serviceId,
        service,
        show,
        isEditMode,
    ]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        setSelectedImages((currentFiles) => {
            const nextFiles = [...currentFiles];

            for (const file of files) {
                if (
                    !nextFiles.some((currentFile) =>
                        sameSelectedFile(currentFile, file),
                    )
                ) {
                    nextFiles.push(file);
                }
            }

            return nextFiles;
        });

        event.target.value = "";
    };

    const openImagePicker = () => {
        imageInputRef.current?.click();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [name]: value,
        }));
    };

    const removeSelectedImage = (indexToRemove) => {
        setSelectedImages((currentFiles) =>
            currentFiles.filter((_, index) => index !== indexToRemove),
        );
    };

    const handleDeleteExistingImage = async (image) => {
        const imageId = image?.id ?? image?.imageId ?? image?.publicId;

        if (!imageId) {
            setError("Không xác định được ảnh cần xóa.");
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa ảnh này không?")) {
            return;
        }

        try {
            setDeletingImageId(String(imageId));
            setError("");
            await deleteImage(imageId);
            setExistingImages((currentImages) =>
                currentImages.filter(
                    (currentImage) =>
                        String(
                            currentImage?.id ??
                                currentImage?.imageId ??
                                currentImage?.publicId,
                        ) !== String(imageId),
                ),
            );
        } catch (deleteError) {
            setError(
                deleteError?.response?.data?.message ||
                    deleteError?.response?.data?.error ||
                    "Không thể xóa ảnh.",
            );
        } finally {
            setDeletingImageId("");
        }
    };

    const validate = () => {
        const requiredValidation = validateRequiredFields(
            form,
            [
                { name: "name", label: "name" },
                { name: "description", label: "description" },
                { name: "price", label: "price" },
                { name: "quantity", label: "quantity" },
                ...serviceFactory.childFields.filter((field) => field.required),
            ],
            {
                messagePrefix: "Vui lòng nhập",
                messageSuffix: ".",
            },
        );

        if (!requiredValidation.valid) {
            setError(requiredValidation.message);
            return false;
        }

        return true;
    };

    const buildPayload = () => {
        const payload = new FormData();

        appendField(payload, "baseInfo.name", form.name.trim());
        appendField(payload, "baseInfo.description", form.description.trim());
        appendField(payload, "baseInfo.price", form.price);
        appendField(payload, "baseInfo.quantity", form.quantity);

        selectedImages.forEach((imageFile) => {
            payload.append("baseInfo.imgFiles", imageFile);
        });

        switch (serviceType) {
            case "TRANSPORTATION":
                appendField(payload, "arrivalLocation", form.arrivalLocation);
                appendField(
                    payload,
                    "departureLocation",
                    form.departureLocation.trim(),
                );
                appendField(payload, "arrivalTime", form.arrivalTime);
                appendField(payload, "departureTime", form.departureTime);
                appendField(
                    payload,
                    "typeOfTransportation",
                    form.typeOfTransportation,
                );
                break;
            case "TOURISM":
                appendField(payload, "tourDuration", form.tourDuration);
                appendField(payload, "location", form.location.trim());
                break;
            case "ACCOMMODATION":
            default:
                appendField(payload, "quantityOfBed", form.quantityOfBed);
                appendField(payload, "area", form.area);
                appendField(payload, "location", form.location.trim());
                break;
        }

        return payload;
    };

    const closeModal = () => {
        if (onHide) {
            onHide();
            return;
        }

        navigate("/provider/services");
    };

    const handleDeleteService = async () => {
        if (!serviceId) {
            return;
        }

        if (!window.confirm("Bạn có chắc muốn xóa dịch vụ này không?")) {
            return;
        }

        try {
            setDeletingService(true);
            setError("");
            await deleteServiceByType(serviceType, serviceId);
            closeModal();
        } catch (deleteError) {
            setError(
                deleteError?.response?.data?.message ||
                    deleteError?.response?.data?.error ||
                    "Không thể xóa dịch vụ.",
            );
        } finally {
            setDeletingService(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            const creator = isEditMode
                ? (payload) =>
                      updateServiceByType(serviceType, serviceId, payload)
                : getServiceCreator(serviceType);

            if (!creator) {
                setError("Loại dịch vụ không hợp lệ.");
                return;
            }

            setError("");
            setSubmitting(true);

            const response = await creator(buildPayload());

            if (response?.status >= 200 && response?.status < 300) {
                closeModal();
                return;
            }

            setError("Hệ thống không phản hồi đúng mong đợi.");
        } catch (submitError) {
            setError(
                submitError?.response?.data?.message ||
                    submitError?.response?.data?.error ||
                    (isEditMode
                        ? "Không thể cập nhật dịch vụ."
                        : "Không thể tạo dịch vụ."),
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={closeModal}
            centered
            size="xl"
            scrollable
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>{serviceFactory.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4 p-md-5">
                {error ? <Alert variant="danger">{error}</Alert> : null}

                {authLoading || initializing ? (
                    <div className="py-5 d-flex justify-content-center">
                        <MySpinner />
                    </div>
                ) : (
                    <Card className="border border-dark-subtle shadow-sm">
                        <Card.Body className="p-0">
                            <Form
                                id="provider-service-form"
                                onSubmit={handleSubmit}
                            >
                                <div className="d-flex flex-column gap-3 p-3 p-md-4">
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="serviceType">
                                                <Form.Label>
                                                    Loại dịch vụ
                                                </Form.Label>
                                                <Form.Control
                                                    value={resolveServiceTypeLabel(
                                                        serviceType,
                                                    )}
                                                    readOnly
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="name">
                                                <Form.Label>
                                                    Tên dịch vụ
                                                </Form.Label>
                                                <Form.Control
                                                    name="name"
                                                    type="text"
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Nhập tên dịch vụ"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="description">
                                                <Form.Label>Mô tả</Form.Label>
                                                <Form.Control
                                                    name="description"
                                                    as="textarea"
                                                    rows={4}
                                                    value={form.description}
                                                    onChange={handleChange}
                                                    placeholder="Mô tả ngắn gọn dịch vụ"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="quantity">
                                                <Form.Label>
                                                    Số lượng
                                                </Form.Label>
                                                <Form.Control
                                                    name="quantity"
                                                    type="number"
                                                    min="1"
                                                    step="1"
                                                    value={form.quantity}
                                                    onChange={handleChange}
                                                    placeholder="Nhập số lượng"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="price">
                                                <Form.Label>Đơn giá</Form.Label>
                                                <Form.Control
                                                    name="price"
                                                    type="number"
                                                    min="0"
                                                    step="1000"
                                                    value={form.price}
                                                    onChange={handleChange}
                                                    placeholder="Nhập giá"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                                                <Form.Label className="mb-0">
                                                    Hình ảnh
                                                </Form.Label>
                                                <div className="text-muted small">
                                                    {existingImages.length +
                                                        selectedImagePreviews.length}{" "}
                                                    ảnh
                                                </div>
                                            </div>
                                            <Form.Control
                                                ref={imageInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="d-none"
                                            />

                                            {existingImages.length === 0 &&
                                            selectedImagePreviews.length ===
                                                0 ? (
                                                <div className="text-muted small mb-2">
                                                    Chưa có ảnh nào.
                                                </div>
                                            ) : null}

                                            <Row className="g-3">
                                                {existingImages.map(
                                                    (image, index) => (
                                                        <Col
                                                            xs={6}
                                                            md={4}
                                                            lg={3}
                                                            key={
                                                                image?.id ??
                                                                image?.imageId ??
                                                                image?.publicId ??
                                                                image?.url ??
                                                                image?.imageUrl ??
                                                                image?.path ??
                                                                index
                                                            }
                                                        >
                                                            <div className="position-relative rounded-3 overflow-hidden border bg-light h-100">
                                                                <Image
                                                                    src={
                                                                        image?.url ||
                                                                        image?.imageUrl ||
                                                                        image?.path ||
                                                                        image
                                                                    }
                                                                    alt="Ảnh hiện có"
                                                                    className="w-100 h-100 object-fit-cover"
                                                                    style={{
                                                                        minHeight: 140,
                                                                    }}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="dark"
                                                                    size="sm"
                                                                    className="position-absolute top-0 end-0 m-2 rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                    }}
                                                                    onClick={() =>
                                                                        handleDeleteExistingImage(
                                                                            image,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deletingImageId ===
                                                                        String(
                                                                            image?.id ??
                                                                                image?.imageId ??
                                                                                image?.publicId ??
                                                                                "",
                                                                        )
                                                                    }
                                                                    aria-label="Xóa ảnh"
                                                                >
                                                                    ×
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    ),
                                                )}

                                                {selectedImagePreviews.map(
                                                    (preview, index) => (
                                                        <Col
                                                            xs={6}
                                                            md={4}
                                                            lg={3}
                                                            key={`${preview.file.name}-${preview.file.lastModified}-${index}`}
                                                        >
                                                            <div className="position-relative rounded-3 overflow-hidden border bg-light h-100">
                                                                <Image
                                                                    src={
                                                                        preview.previewUrl
                                                                    }
                                                                    alt={
                                                                        preview
                                                                            .file
                                                                            .name
                                                                    }
                                                                    className="w-100 h-100 object-fit-cover"
                                                                    style={{
                                                                        minHeight: 140,
                                                                    }}
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="dark"
                                                                    size="sm"
                                                                    className="position-absolute top-0 end-0 m-2 rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                    }}
                                                                    onClick={() =>
                                                                        removeSelectedImage(
                                                                            index,
                                                                        )
                                                                    }
                                                                    aria-label="Xóa ảnh mới chọn"
                                                                >
                                                                    ×
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    ),
                                                )}

                                                <Col xs={6} md={4} lg={3}>
                                                    <Button
                                                        type="button"
                                                        variant="outline-secondary"
                                                        className="w-100 h-100 rounded-3 d-flex flex-column align-items-center justify-content-center text-decoration-none"
                                                        style={{
                                                            minHeight: 140,
                                                            borderStyle:
                                                                "dashed",
                                                        }}
                                                        onClick={
                                                            openImagePicker
                                                        }
                                                    >
                                                        <span className="fs-1 lh-1">
                                                            +
                                                        </span>
                                                        <span className="small mt-2">
                                                            Thêm ảnh
                                                        </span>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>

                                        {serviceFactory.childFields.map(
                                            (field) => (
                                                <Col
                                                    xs={12}
                                                    md={
                                                        field.name ===
                                                        "location"
                                                            ? 12
                                                            : 6
                                                    }
                                                    key={field.name}
                                                >
                                                    <Form.Group
                                                        controlId={field.name}
                                                    >
                                                        <Form.Label>
                                                            {field.label}
                                                        </Form.Label>
                                                        {field.type ===
                                                        "select" ? (
                                                            <Form.Select
                                                                name={
                                                                    field.name
                                                                }
                                                                value={
                                                                    form[
                                                                        field
                                                                            .name
                                                                    ]
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                            >
                                                                <option value="">
                                                                    Chọn{" "}
                                                                    {field.label.toLowerCase()}
                                                                </option>
                                                                {(
                                                                    field.options ||
                                                                    []
                                                                ).map(
                                                                    (
                                                                        option,
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                option.value
                                                                            }
                                                                            value={
                                                                                option.value
                                                                            }
                                                                        >
                                                                            {
                                                                                option.label
                                                                            }
                                                                        </option>
                                                                    ),
                                                                )}
                                                            </Form.Select>
                                                        ) : (
                                                            <Form.Control
                                                                name={
                                                                    field.name
                                                                }
                                                                type={
                                                                    field.type
                                                                }
                                                                min={field.min}
                                                                step={
                                                                    field.step
                                                                }
                                                                value={
                                                                    form[
                                                                        field
                                                                            .name
                                                                    ]
                                                                }
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                placeholder={
                                                                    field.label
                                                                }
                                                            />
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            ),
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
                    {isEditMode ? (
                        <Button
                            type="button"
                            variant="outline-danger"
                            onClick={handleDeleteService}
                            disabled={submitting || deletingService}
                        >
                            {deletingService ? "Đang xóa..." : "Xóa dịch vụ"}
                        </Button>
                    ) : null}
                </div>

                <div className="d-flex gap-2 ms-auto">
                    <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={closeModal}
                        disabled={submitting || deletingService}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        form="provider-service-form"
                        variant="primary"
                        disabled={submitting || deletingService}
                    >
                        {submitting ? (
                            <MySpinner />
                        ) : (
                            serviceFactory.submitLabel
                        )}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalCreateEditService;
