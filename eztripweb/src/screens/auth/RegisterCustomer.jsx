import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import Apis, { endpoints } from "../../configs/Apis";

const customerFields = [
	{
		field: "fullname",
		title: "Họ và tên",
		type: "text",
		autoComplete: "name",
	},
	{
		field: "email",
		title: "Email",
		type: "email",
		autoComplete: "email",
	},
	{
		field: "phoneNumber",
		title: "Số điện thoại",
		type: "tel",
		autoComplete: "tel",
	},
	{
		field: "password",
		title: "Mật khẩu",
		type: "password",
		autoComplete: "new-password",
	},
	{
		field: "confirmPassword",
		title: "Xác nhận mật khẩu",
		type: "password",
		autoComplete: "new-password",
	},
];

const genderOptions = [
	{ value: "", label: "Chọn giới tính" },
	{ value: "MALE", label: "Nam" },
	{ value: "FEMALE", label: "Nữ" },
	{ value: "OTHER", label: "Khác" },
];

const RegisterCustomer = () => {
	const [user, setUser] = useState({ role: "CUSTOMER" });
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);
	const avatar = useRef();
	const nav = useNavigate();

	const validate = () => {
		for (const field of customerFields) {
			if (!user[field.field]) {
				setErr(`Vui lòng nhập ${field.title}!`);
				return false;
			}
		}

		if (!user.gender) {
			setErr("Vui lòng chọn giới tính!");
			return false;
		}

		if (!user.dob) {
			setErr("Vui lòng chọn ngày sinh!");
			return false;
		}

		if (user.password !== user.confirmPassword) {
			setErr("Mật khẩu KHÔNG khớp!");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validate()) {
			return;
		}

		const form = new FormData();
		form.append("fullname", user.fullname);
		form.append("email", user.email);
		form.append("phoneNumber", user.phoneNumber);
		form.append("password", user.password);
		form.append("role", user.role);
		form.append("gender", user.gender);
		form.append("dob", user.dob);

		if (avatar.current?.files?.length > 0) {
			form.append("avatar", avatar.current.files[0]);
		}

		try {
			setErr("");
			setLoading(true);

			const response = await Apis.post(endpoints.register, form, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 201) {
				nav("/login");
				return;
			}

			setErr("Hệ thống bị lỗi!");
		} catch (exception) {
			setErr(
				exception?.response?.data?.message ||
					exception?.response?.data?.error ||
					"Đăng ký thất bại",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CustomerLayout>
			<div className="mx-auto py-4 px-3" style={{ maxWidth: 640 }}>
				<Card className="shadow-sm border-0">
					<Card.Body className="p-4 p-md-5">
						<div className="mb-4 text-center">
							<h1 className="h3 text-success mb-2">Đăng ký khách hàng</h1>
							<p className="text-muted mb-0">
								Tạo tài khoản để đặt tour, lưu trú và phương tiện nhanh hơn.
							</p>
						</div>

						{err && <Alert variant="danger">{err}</Alert>}

						<Form onSubmit={handleSubmit}>
							{customerFields.map((field) => (
								<Form.Group key={field.field} className="mb-3" controlId={field.field}>
									<Form.Label>{field.title}</Form.Label>
									<Form.Control
										type={field.type}
										placeholder={field.title}
										autoComplete={field.autoComplete}
										value={user[field.field] || ""}
										onChange={(event) =>
											setUser({
												...user,
												[field.field]: event.target.value,
											})
										}
									/>
								</Form.Group>
							))}

							<Form.Group className="mb-3" controlId="gender">
								<Form.Label>Giới tính</Form.Label>
								<Form.Select
									value={user.gender || ""}
									onChange={(event) =>
										setUser({
											...user,
											gender: event.target.value,
										})
									}
								>
									{genderOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Form.Select>
							</Form.Group>

							<Form.Group className="mb-3" controlId="dob">
								<Form.Label>Ngày sinh</Form.Label>
								<Form.Control
									type="date"
									value={user.dob || ""}
									onChange={(event) =>
										setUser({
											...user,
											dob: event.target.value,
										})
									}
								/>
							</Form.Group>

							<Form.Group className="mb-4" controlId="avatar">
								<Form.Label>Ảnh đại diện</Form.Label>
								<Form.Control type="file" ref={avatar} accept="image/*" />
							</Form.Group>

							<div className="d-grid gap-2">
								{loading ? <MySpinner /> : <Button variant="success" type="submit">Đăng ký</Button>}
								<Button as={Link} to="/register/provider" variant="outline-secondary">
									Tôi là nhà cung cấp
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</div>
		</CustomerLayout>
	);
};

export default RegisterCustomer;
