import { useEffect, useState } from "react";
import { Alert, Badge, Button, Col, Form, Image, Modal, Row, Spinner } from "react-bootstrap";
import { useLookupTables } from "@contexts/LookupTablesContext";
import { fetchCurrentUser, updateCurrentUserProfile } from "@services/authService";
import { useAuth } from "@hooks/useAuth";
import { backendDobToInput } from "@utils/formatters";

function ModalProfile({ show, onHide }) {
    const { currentUser, syncCurrentUser } = useAuth();
    const { lookupTables } = useLookupTables();
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    
    const [form, setForm] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        dob: "",
        gender: "",
        companyName: "",
        companyAddress: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const isProvider = currentUser?.role === 3;
    const isCustomer = currentUser?.role === 2;
    const displayName = currentUser?.fullname || currentUser?.name || "Hồ sơ";

    useEffect(() => {
        if (!show) return;
        let isMounted = true;

        async function loadProfile() {
            setLoading(true);
            setError("");

            try {
                const profile = await fetchCurrentUser();
                if (!profile) throw new Error("Empty profile response");
                if (!isMounted) return;

                setForm(prev => ({
                    ...prev,
                    fullname: profile?.fullname || "",
                    email: profile?.email || "",
                    phoneNumber: profile?.phoneNumber || "",
                    dob: backendDobToInput(profile?.customerProfile?.dob || ""),
                    gender: profile?.customerProfile?.gender || "",
                    companyName: profile?.providerProfile?.companyName || "",
                    companyAddress: profile?.providerProfile?.companyAddress || "",
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
                setAvatarFile(null);
                setAvatarPreview(profile?.avatar || "");
            } catch (fetchError) {
                console.error("Failed to fetch profile:", fetchError);
                if (isMounted) {
                    setError(fetchError?.response?.data?.error || fetchError?.message || "Không thể tải profile.");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        loadProfile();
        return () => { isMounted = false; };
    }, [show]);

    useEffect(() => {
        if (!avatarFile) return;
        const previewUrl = URL.createObjectURL(avatarFile);
        setAvatarPreview(previewUrl);
        return () => URL.revokeObjectURL(previewUrl);
    }, [avatarFile]);

    function handleChange(event) {
        const { name, value, files } = event.target;
        if (name === "avatar") {
            setAvatarFile(files?.[0] || null);
            return;
        }
        setForm(currentForm => ({ ...currentForm, [name]: value }));
    }

    const validatePasswordMutation = () => {
        const { oldPassword, newPassword, confirmPassword } = form;
        
        if (!oldPassword && !newPassword && !confirmPassword) {
            return true; 
        }

        if (newPassword && !oldPassword) {
            setError("Vui lòng nhập mật khẩu cũ để xác thực.");
            return false;
        }
        if (oldPassword && !newPassword) {
            setError("Vui lòng nhập mật khẩu mới.");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!validatePasswordMutation()) {
            return;
        }

        setSaving(true);

        try {
            const payload = new FormData();
            
            payload.append("fullname", form.fullname || "");
            payload.append("email", form.email || "");
            
            if (avatarFile) {
                payload.append("avatar", avatarFile);
            }

            if (form.oldPassword && form.newPassword) {
                payload.append("oldPassword", form.oldPassword);
                payload.append("newPassword", form.newPassword);
            }

            if (isCustomer) {
                payload.append("dob", form.dob || "");
                payload.append("gender", form.gender || "");
            } else if (isProvider) {
                payload.append("companyName", form.companyName || "");
                payload.append("companyAddress", form.companyAddress || "");
            }

            const updatedProfile = await updateCurrentUserProfile(payload);

            if (!isProvider) {
                syncCurrentUser(updatedProfile);
            }
            onHide();
        } catch (submitError) {
            setError(submitError?.response?.data?.error || submitError?.response?.data?.message || "Không thể cập nhật profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered scrollable backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        {isProvider && (
                            <Alert variant="warning">
                                Nhà cung cấp lưu ý: Khi thay đổi thông tin của mình, thay đổi sẽ được gửi để chờ Admin phê duyệt (Approval) và sẽ không có hiệu lực ngay lập tức.
                            </Alert>
                        )}
                        
                        {error && (
                            <Alert variant="danger">
                                {error}
                            </Alert>
                        )}

                        <Row className="g-4">
                            <Col xs={12} md={4}>
                                <div className="text-center border rounded-4 p-4 h-100 bg-light">
                                    <div className="mb-3 d-flex justify-content-center">
                                        {avatarPreview ? (
                                            <Image src={avatarPreview} alt={displayName} width={120} height={120} className="rounded-circle border object-fit-cover" />
                                        ) : (
                                            <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary fw-semibold" style={{ width: 120, height: 120 }}>
                                                {displayName.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "EZ"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="fw-semibold fs-5">{displayName}</div>
                                    <div className="text-muted small mb-3">{currentUser?.role}</div>
                                    <Badge bg="secondary" className="mb-3">{currentUser?.email || "Chưa có email"}</Badge>
                                    
                                    <Form.Group controlId="profileAvatar" className="text-start mt-3">
                                        <Form.Label>Ảnh đại diện</Form.Label>
                                        <Form.Control name="avatar" type="file" accept="image/*" onChange={handleChange} disabled={saving} />
                                    </Form.Group>
                                </div>
                            </Col>

                            <Col xs={12} md={8}>
                                <div className="mb-4">
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileFullname">
                                                <Form.Label>Họ và tên</Form.Label>
                                                <Form.Control name="fullname" value={form.fullname} onChange={handleChange} placeholder="Nhập họ và tên" disabled={saving} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control name="email" type="email" value={form.email} onChange={handleChange} placeholder="Nhập email" disabled={saving} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group controlId="profilePhoneNumber">
                                                <Form.Label>Số điện thoại đăng nhập</Form.Label>
                                                <Form.Control name="phoneNumber" value={form.phoneNumber} disabled readOnly />
                                            </Form.Group>
                                        </Col>
                                        
                                        {isCustomer && (
                                            <>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="profileDob">
                                                        <Form.Label>Ngày sinh</Form.Label>
                                                        <Form.Control name="dob" type="date" value={form.dob} onChange={handleChange} disabled={saving} />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group controlId="profileGender">
                                                        <Form.Label>Giới tính</Form.Label>
                                                        <Form.Select name="gender" value={form.gender} onChange={handleChange} disabled={saving}>
                                                            <option value="">Chọn giới tính</option>
                                                            {(lookupTables?.genders || []).map((gender) => (
                                                                <option key={gender.value} value={gender.value}>{gender.label}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}

                                        {isProvider && (
                                            <>
                                                <Col xs={12}>
                                                    <Form.Group controlId="profileCompanyName">
                                                        <Form.Label>Tên công ty</Form.Label>
                                                        <Form.Control name="companyName" value={form.companyName} onChange={handleChange} placeholder="Nhập tên công ty" disabled={saving} />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12}>
                                                    <Form.Group controlId="profileCompanyAddress">
                                                        <Form.Label>Địa chỉ công ty</Form.Label>
                                                        <Form.Control name="companyAddress" value={form.companyAddress} onChange={handleChange} placeholder="Nhập địa chỉ công ty" disabled={saving} />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )}
                                    </Row>
                                </div>

                                <div>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group controlId="profileOldPassword">
                                                <Form.Label>Mật khẩu cũ</Form.Label>
                                                <Form.Control name="oldPassword" type="password" value={form.oldPassword} onChange={handleChange} placeholder="Nhập mật khẩu hiện tại" disabled={saving} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileNewPassword">
                                                <Form.Label>Mật khẩu mới</Form.Label>
                                                <Form.Control name="newPassword" type="password" value={form.newPassword} onChange={handleChange} placeholder="Nhập mật khẩu mới" disabled={saving} />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group controlId="profileConfirmPassword">
                                                <Form.Label>Xác nhận mật khẩu</Form.Label>
                                                <Form.Control name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Nhập lại mật khẩu mới" disabled={saving} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={loading || saving}>
                    {saving ? "Đang xử lý..." : "Lưu thay đổi"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalProfile;