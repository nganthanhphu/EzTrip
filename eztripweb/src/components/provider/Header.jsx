import { useState } from "react";
import { Button, Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import ModalProfile from "@components/common/ModalProfile";

function Header() {
    const { currentUser } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/">EzTrip</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/provider/dashboard">Dashboard</Link>
                        <Link className="nav-link" to="/provider/services">Quản lý Dịch vụ</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <Container className="d-flex justify-content-end">
                <Nav>
                    {currentUser && (
                        <Button variant="link" className="nav-link p-0 text-decoration-none" onClick={() => setShowProfileModal(true)}>
                            {currentUser.name || currentUser.fullname || "Hồ sơ"}
                        </Button>
                    )}
                    <Link className="nav-link" to="/provider/logout">Đăng xuất</Link>
                </Nav>
            </Container>
            <ModalProfile show={showProfileModal} onHide={() => setShowProfileModal(false)} />
        </Navbar>
    );
}

export default Header;