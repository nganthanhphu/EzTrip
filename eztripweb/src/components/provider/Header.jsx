import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
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
                    <Link className="nav-link" to="/provider/profile">Hồ sơ</Link>
                    <Link className="nav-link" to="/provider/logout">Đăng xuất</Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;