import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AppNavbar = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" className="bg-dark navbar-dark shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          🎶 Entertainment Agency
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto gap-3">
            <Nav.Link
              as={Link}
              to="/"
              active={location.pathname === "/"}
              className="fs-6"
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/entertainers"
              active={location.pathname.startsWith("/entertainers")}
              className="fs-6"
            >
              Entertainers
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/entertainer/add"
              active={location.pathname === "/entertainer/add"}
              className="fs-6"
            >
              ➕ Add Entertainer
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
