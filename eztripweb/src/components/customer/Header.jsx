import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

function Header() {
	const { currentUser } = useAuth();

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Link className="navbar-brand" to="/">EzTrip</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/accommodation">Lưu trú</Link>
                        <Link className="nav-link" to="/transportation">Di chuyển</Link>
                        <Link className="nav-link" to="/tours">Tour du lịch</Link>
                        <Link className="nav-link" to="/history">Lịch sử đặt dịch vụ</Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>

            <Container className="d-flex justify-content-end">
                <Nav>
                    {currentUser ? (
                        <>
                            <Link className="nav-link" to="/profile">{currentUser.name}</Link>
                            <Link className="nav-link" to="/logout">Đăng xuất</Link>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Đăng nhập</Link>
                            <Link className="nav-link" to="/register">Đăng ký</Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;