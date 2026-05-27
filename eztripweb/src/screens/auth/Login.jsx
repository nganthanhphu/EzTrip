import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomerLayout from "@layouts/CustomerLayout";
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
            <div className="mx-auto" style={{ maxWidth: 420 }}>
                <h2 className="text-center text-success mt-1 mb-4">
                    ĐĂNG NHẬP NGƯỜI DÙNG
                </h2>

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

                    <Form.Group className="mb-3" controlId="button">
                        {submitting || loading ? (
                            <Spinner animation="border" role="status" />
                        ) : (
                            <Button variant="success" type="submit" className="w-100">
                                Đăng nhập
                            </Button>
                        )}
                    </Form.Group>
                </Form>
            </div>
        </CustomerLayout>
    );
}

export default Login;