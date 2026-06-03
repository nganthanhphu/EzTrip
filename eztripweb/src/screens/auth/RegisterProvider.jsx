import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import { useLookupTables } from "@contexts/LookupTablesContext";
import { validatePasswordConfirmation, validateRequiredFields } from "@utils/validators";

import { registerUser } from "@services/authService";

const providerFields = [
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
	{
		field: "companyName",
		title: "Tên công ty",
		type: "text",
		autoComplete: "organization",
	},
];

const RegisterProvider = () => {
	const [user, setUser] = useState({ role: 3 });
	const [err, setErr] = useState("");
	const [loading, setLoading] = useState(false);
	const avatar = useRef();
	const nav = useNavigate();
	const { lookupTables } = useLookupTables();
	const providerTypeOptions = [{ value: "", label: "Chọn loại nhà cung cấp" }, ...lookupTables.typeOfProviders];

	const validate = () => {
		const requiredValidation = validateRequiredFields(user, [
			...providerFields.map((field) => ({
				name: field.field,
				label: field.title,
			})),
			{ name: "typeOfProvider", label: "loại nhà cung cấp" },
		]);

		if (!requiredValidation.valid) {
			setErr(requiredValidation.message);
			return false;
		}

		const passwordValidation = validatePasswordConfirmation(
			user.password,
			user.confirmPassword,
		);

		if (!passwordValidation.valid) {
			setErr(passwordValidation.message);
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        const form = new FormData();

        try {
            setErr("");
            setLoading(true);

            await registerUser(form);

            nav("/login");
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
			<div className="mx-auto py-4 px-3" style={{ maxWidth: 720 }}>
				<Card className="shadow-sm border-0">
					<Card.Body className="p-4 p-md-5">
						<div className="mb-4 text-center">
							<h1 className="h3 text-success mb-2">Đăng ký nhà cung cấp</h1>
							<p className="text-muted mb-0">
								Khai báo thông tin doanh nghiệp để tạo tài khoản cung cấp dịch vụ.
							</p>
						</div>

						{err && <Alert variant="danger">{err}</Alert>}

						<Form onSubmit={handleSubmit}>
							{providerFields.map((field) => (
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

							<Form.Group className="mb-3" controlId="companyAddress">
								<Form.Label>Địa chỉ công ty</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									placeholder="Nhập địa chỉ công ty"
									value={user.companyAddress || ""}
									onChange={(event) =>
										setUser({
											...user,
											companyAddress: event.target.value,
										})
									}
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="typeOfProvider">
								<Form.Label>Loại nhà cung cấp</Form.Label>
								<Form.Select
									value={user.typeOfProvider || ""}
									onChange={(event) =>
										setUser({
											...user,
											typeOfProvider: event.target.value,
										})
									}
								>
									{providerTypeOptions.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Form.Select>
							</Form.Group>

							<Form.Group className="mb-4" controlId="avatar">
								<Form.Label>Ảnh đại diện</Form.Label>
								<Form.Control type="file" ref={avatar} accept="image/*" />
							</Form.Group>

							<div className="d-grid gap-2">
								{loading ? <MySpinner /> : <Button variant="success" type="submit">Đăng ký</Button>}
								<Button as={Link} to="/register" variant="outline-secondary">
									Tôi là khách hàng
								</Button>
							</div>
						</Form>
					</Card.Body>
				</Card>
			</div>
		</CustomerLayout>
	);
};

export default RegisterProvider;
