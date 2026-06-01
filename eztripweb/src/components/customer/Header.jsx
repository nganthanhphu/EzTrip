import { useState } from "react";
import { Button, Container, Navbar, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import ModalProfile from "@components/common/ModalProfile";
import defaultAvatar from "@assets/images/default_avatar.jpg";

function Header() {
	const { currentUser } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const avatarSrc = currentUser?.avatar || defaultAvatar;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/">
                    EzTrip
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/accommodations">
                            Lưu trú
                        </Link>
                        <Link className="nav-link" to="/transportations">
                            Di chuyển
                        </Link>
                        <Link className="nav-link" to="/tours">
                            Tour du lịch
                        </Link>
                        <Link className="nav-link" to="/history">
                            Lịch sử đặt dịch vụ
                        </Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <Container className="d-flex justify-content-end">
                <Nav>
                    {currentUser ? (
                        <>
                            <Image
                                src={avatarSrc}
                                alt={currentUser?.fullname || "Avatar"}
                                roundedCircle
                                className="me-2"
                                style={{
                                    width: 32,
                                    height: 32,
                                    objectFit: "cover",
                                }}
                            />
                            <Button
                                variant="link"
                                className="nav-link p-0 text-decoration-none"
                                onClick={() => setShowProfileModal(true)}
                            >
                                {currentUser.fullname}
                            </Button>
                            <Link className="nav-link" to="/logout">
                                Đăng xuất
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">
                                Đăng nhập
                            </Link>
                            <Link className="nav-link" to="/register">
                                Đăng ký
                            </Link>
                        </>
                    )}
                </Nav>
            </Container>
            <ModalProfile
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
            />
        </Navbar>
    );
}

export default Header;