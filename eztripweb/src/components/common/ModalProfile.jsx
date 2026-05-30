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
		companyAddress: ""
	});

	const isCustomer = currentUser?.role === "CUSTOMER";
	const isProvider = currentUser?.role === "PROVIDER";

	useEffect(() => {
		if (!show) {
			return;
		}

		let isMounted = true;

		async function loadProfile() {
			setLoading(true);
			setError("");

			try {
				const profile = await fetchCurrentUser();

				if (!profile) {
					throw new Error("Empty profile response");
				}

				if (!isMounted) {
					return;
				}

				setForm({
					fullname: profile?.fullname || "",
					email: profile?.email || "",
					phoneNumber: profile?.phoneNumber || "",
					dob: backendDobToInput(profile?.customerProfile?.dob || ""),
					gender: profile?.customerProfile?.gender || "",
					companyName: profile?.providerProfile?.companyName || "",
					companyAddress: profile?.providerProfile?.companyAddress || ""
				});
				setAvatarFile(null);
				setAvatarPreview(profile?.avatar || "");
			} catch (fetchError) {
				console.error("Failed to fetch profile:", fetchError);

				if (isMounted) {
					setError(fetchError?.response?.data?.error || fetchError?.message || "Không thể tải profile.");
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadProfile();

		return () => {
			isMounted = false;
		};
	}, [show]);

	async function handleReload() {
		setLoading(true);
		setError("");

		try {
			const profile = await fetchCurrentUser();

			if (!profile) {
				throw new Error("Empty profile response");
			}

			setForm({
				fullname: profile?.fullname || "",
				email: profile?.email || "",
				phoneNumber: profile?.phoneNumber || "",
				dob: profile?.customerProfile?.dob || "",
				gender: profile?.customerProfile?.gender || "",
				companyName: profile?.providerProfile?.companyName || "",
				companyAddress: profile?.providerProfile?.companyAddress || ""
			});
			setAvatarFile(null);
			setAvatarPreview(profile?.avatar || "");
		} catch (fetchError) {
			console.error("Failed to fetch profile:", fetchError);
			setError(fetchError?.response?.data?.error || fetchError?.message || "Không thể tải profile.");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (!avatarFile) {
			return;
		}

		const previewUrl = URL.createObjectURL(avatarFile);
		setAvatarPreview(previewUrl);

		return () => {
			URL.revokeObjectURL(previewUrl);
		};
	}, [avatarFile]);

	const handleChange = (event) => {
		const { name, value, files } = event.target;

		if (name === "avatar") {
			setAvatarFile(files?.[0] || null);
			return;
		}

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSaving(true);
		setError("");

		try {
			const payload = new FormData();
			payload.append("fullname", form.fullname || "");
			payload.append("email", form.email || "");

			if (isCustomer) {
				payload.append("dob", form.dob || "");
				payload.append("gender", form.gender || "");
			}

			if (isProvider) {
				payload.append("companyName", form.companyName || "");
				payload.append("companyAddress", form.companyAddress || "");
			}

			if (avatarFile) {
				payload.append("avatar", avatarFile);
			}

			const updatedProfile = await updateCurrentUserProfile(payload);
			syncCurrentUser(updatedProfile);
			onHide();
		} catch (submitError) {
			setError(submitError?.response?.data?.error || "Không thể cập nhật profile.");
		} finally {
			setSaving(false);
		}
	};

	const displayName = currentUser?.fullname || currentUser?.name || "Hồ sơ";


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
						{error ? (
							<Alert variant="danger">
								{error}
								<div className="mt-2">
									<Button size="sm" onClick={handleReload}>Thử lại</Button>
								</div>
							</Alert>
						) : null}
						<Row className="g-4">
							<Col xs={12} md={4}>
								<div className="text-center border rounded-4 p-4 h-100 bg-light">
									<div className="mb-3 d-flex justify-content-center">
										{avatarPreview ? (
											<Image src={avatarPreview} alt={displayName} width={120} height={120} className="rounded-circle border object-fit-cover" />
										) : (
											<div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-secondary fw-semibold" style={{ width: 120, height: 120 }}>
												{displayName
													.split(" ")
													.filter(Boolean)
													.slice(0, 2)
													.map((word) => word[0])
													.join("")
													.toUpperCase() || "EZ"}
											</div>
										)}
									</div>
									<div className="fw-semibold fs-5">{displayName}</div>
									<div className="text-muted small mb-3">{currentUser?.role}</div>
									<Badge bg="secondary" className="mb-3">{currentUser?.email || "Chưa có email"}</Badge>
									<Form.Group controlId="profileAvatar" className="text-start">
										<Form.Label>Ảnh đại diện</Form.Label>
										<Form.Control name="avatar" type="file" accept="image/*" onChange={handleChange} />
									</Form.Group>
								</div>
							</Col>
							<Col xs={12} md={8}>
								<Row className="g-3">
									<Col xs={12} md={6}>
										<Form.Group controlId="profileFullname">
											<Form.Label>Họ và tên</Form.Label>
											<Form.Control name="fullname" value={form.fullname} onChange={handleChange} placeholder="Nhập họ và tên" />
										</Form.Group>
									</Col>
									<Col xs={12} md={6}>
										<Form.Group controlId="profileEmail">
											<Form.Label>Email</Form.Label>
											<Form.Control name="email" type="email" value={form.email} onChange={handleChange} placeholder="Nhập email" />
										</Form.Group>
									</Col>
									<Col xs={12}>
										<Form.Group controlId="profilePhoneNumber">
											<Form.Label>Số điện thoại đăng nhập</Form.Label>
											<Form.Control name="phoneNumber" value={form.phoneNumber} disabled readOnly />
											<Form.Text className="text-muted">Số điện thoại dùng để đăng nhập nên được giữ cố định.</Form.Text>
										</Form.Group>
									</Col>
									{isCustomer ? (
										<>
											<Col xs={12} md={6}>
												<Form.Group controlId="profileDob">
													<Form.Label>Ngày sinh</Form.Label>
													<Form.Control name="dob" type="date" value={form.dob} onChange={handleChange} />
												</Form.Group>
											</Col>
											<Col xs={12} md={6}>
												<Form.Group controlId="profileGender">
													<Form.Label>Giới tính</Form.Label>
													<Form.Select name="gender" value={form.gender} onChange={handleChange}>
														<option value="">Chọn giới tính</option>
														{(lookupTables?.genders || []).map((gender) => (
															<option key={gender.value} value={gender.value}>{gender.label}</option>
														))}
													</Form.Select>
												</Form.Group>
											</Col>
										</>
									) : null}
									{isProvider ? (
										<>
											<Col xs={12}>
												<Form.Group controlId="profileCompanyName">
													<Form.Label>Tên công ty</Form.Label>
													<Form.Control name="companyName" value={form.companyName} onChange={handleChange} placeholder="Nhập tên công ty" />
												</Form.Group>
											</Col>
											<Col xs={12}>
												<Form.Group controlId="profileCompanyAddress">
													<Form.Label>Địa chỉ công ty</Form.Label>
													<Form.Control name="companyAddress" value={form.companyAddress} onChange={handleChange} placeholder="Nhập địa chỉ công ty" />
												</Form.Group>
											</Col>
										</>
									) : null}
								</Row>
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
					{saving ? "Đang lưu..." : "Lưu thay đổi"}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default ModalProfile;
