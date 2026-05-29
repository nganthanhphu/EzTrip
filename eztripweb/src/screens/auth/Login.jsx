import { useEffect, useState } from "react";
import { Alert, Button, Form, Card } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
import MySpinner from "@components/common/MySpinner";
import { useAuth } from "@hooks/useAuth";

function Login() {
    const nav = useNavigate();
    const [q] = useSearchParams();
    const { login, loading, isAuthenticated } = useAuth();

    const userInfo = [
        {
            field: "phoneNumber",
            title: "Số điện thoại",
            type: "tel",
            autoComplete: "username",
        },
        {
            field: "password",
            title: "Mật khẩu",
            type: "password",
            autoComplete: "current-password",
        },
    ];

    const [user, setUser] = useState({});
    const [err, setErr] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const next = q.get("next");
            nav(next || "/");
        }
    }, [isAuthenticated, nav, q]);

    const validate = () => {
        for (const field of userInfo) {
            if (!(field.field in user) || !user[field.field]) {
                setErr(`Vui lòng nhập ${field.title}!`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        setErr("");
        setSubmitting(true);

        try {
            await login(user.phoneNumber, user.password);

            const next = q.get("next");
            nav(next || "/");
        } catch (exception) {
            setErr(
                exception?.response?.data?.error ||
                    exception.message ||
                    "Đăng nhập thất bại",
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomerLayout>
            <div className="mx-auto py-4 px-3" style={{ maxWidth: 640 }}>
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4 p-md-5">
                        <div className="mb-4 text-center">
                            <h1 className="h3 text-success mb-2">ĐĂNG NHẬP NGƯỜI DÙNG</h1>
                            <p className="text-muted mb-0">Đăng nhập để sử dụng hệ thống EzTrip</p>
                        </div>

                        {err && <Alert variant="danger">{err}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            {userInfo.map((field) => (
                                <Form.Group key={field.field} className="mb-3" controlId={field.field}>
                                    <Form.Label>{field.title}</Form.Label>
                                    <Form.Control
                                        type={field.type}
                                        placeholder={field.title}
                                        autoComplete={field.autoComplete}
                                        value={user[field.field] || ""}
                                        onChange={(e) =>
                                            setUser({
                                                ...user,
                                                [field.field]: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                            ))}

                            <div className="d-grid gap-2 mb-3">
                                {submitting || loading ? (
                                    <MySpinner />
                                ) : (
                                    <Button variant="success" type="submit">
                                        Đăng nhập
                                    </Button>
                                )}
                                <Button as={Link} to="/register" variant="outline-secondary">
                                    Tạo tài khoản mới
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </CustomerLayout>
    );
}

export default Login;