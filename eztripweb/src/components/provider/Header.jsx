import { useState } from "react";
import { Button, Container, Navbar, Nav, Image, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import ModalProfile from "@components/common/ModalProfile";
import defaultAvatar from "@assets/images/default_avatar.jpg";

function HeaderProvider() {
    const { currentUser } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const avatarSrc = currentUser?.avatar || currentUser?.profile?.avatar || defaultAvatar;

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/provider">
                    EzTrip
                </Link>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/provider/dashboard">
                            Dashboard
                        </Link>
                        <Link className="nav-link" to="/provider/services">
                            Quản lý Dịch vụ
                        </Link>
                        <Link className="nav-link" to="/provider/chats">
                            Tin nhắn
                        </Link>
                    </Nav>

                    <Nav className="ms-auto align-items-lg-center mt-3 mt-lg-0">
                        {currentUser ? (
                            <>
                                <div className="d-flex align-items-center px-lg-3 py-2 py-lg-0">
                                    <Image 
                                        src={avatarSrc} 
                                        alt={currentUser?.fullname || "Avatar"} 
                                        roundedCircle 
                                        style={{ width: 32, height: 32, objectFit: "cover" }} 
                                    />
                                    <Button 
                                        variant="link" 
                                        className="nav-link p-0 text-decoration-none ms-2" 
                                        onClick={() => setShowProfileModal(true)}
                                    >
                                        {currentUser.fullname || "Hồ sơ"}
                                    </Button>
                                    {currentUser?.isActive === false && (
                                        <Badge bg="danger" className="ms-2">
                                            Tài khoản bị khóa
                                        </Badge>
                                    )}
                                    {currentUser?.isActive === true && (
                                        <Badge bg="success" className="ms-2">
                                            Đang hoạt động
                                        </Badge>
                                    )}

                                </div>
                                <Link className="nav-link" to="/provider/logout">
                                    Đăng xuất
                                </Link>
                            </>
                        ) : (
                            <Link className="nav-link" to="/login">
                                Đăng nhập
                            </Link>
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

export default HeaderProvider;