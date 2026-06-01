import { useState } from "react";
import { Button, Container, Navbar, Nav, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import ModalProfile from "@components/common/ModalProfile";
import defaultAvatar from "@assets/images/default_avatar.jpg";

function HeaderCustomer() {
    const { currentUser } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const avatarSrc = currentUser?.avatar || defaultAvatar;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/">
                    EzTrip
                </Link>
                
                {/* Nút Hamburger cho màn hình nhỏ */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Nhóm menu chính: me-auto đẩy phần tử tiếp theo về bên phải */}
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

                    {/* Nhóm hồ sơ người dùng: ms-auto để nằm ở góc phải trên Desktop */}
                    <Nav className="ms-auto align-items-lg-center mt-3 mt-lg-0">
                        {currentUser ? (
                            <>
                                {/* Bọc Avatar và Tên vào một cụm flex để không bị rớt dòng */}
                                <div className="d-flex align-items-center px-lg-3 py-2 py-lg-0">
                                    <Image
                                        src={avatarSrc}
                                        alt={currentUser?.fullname || "Avatar"}
                                        roundedCircle
                                        style={{
                                            width: 32,
                                            height: 32,
                                            objectFit: "cover",
                                        }}
                                    />
                                    <Button
                                        variant="link"
                                        className="nav-link p-0 text-decoration-none ms-2"
                                        onClick={() => setShowProfileModal(true)}
                                    >
                                        {currentUser.fullname}
                                    </Button>
                                </div>
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
                </Navbar.Collapse>
            </Container>
            
            <ModalProfile
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
            />
        </Navbar>
    );
}

export default HeaderCustomer;