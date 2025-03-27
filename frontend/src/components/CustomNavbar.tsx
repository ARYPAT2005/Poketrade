import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

interface CustomNavbarProps {
  isLogged: boolean;
  setNavbarExpanded: (expanded: boolean) => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ isLogged, setNavbarExpanded }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar
      bg="transparent"
      className="shadow-sm"
      expand="lg"
      fixed="top"
      onToggle={(expanded) => setNavbarExpanded(expanded)}
    >
      <Navbar.Brand style={{ paddingLeft: "20px" }} href="/">
        Pokétrade
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/marketplace">Marketplace</Nav.Link>
          <Nav.Link href="/trade">Trade</Nav.Link>
          <Nav.Link href="/store">Store</Nav.Link>
        </Nav>
        <Dropdown style={{ marginRight: "10px" }}>
          <Dropdown.Toggle id="dropdown-basic" variant="outline-dark">
            <PersonCircle />
          </Dropdown.Toggle>
          <Dropdown.Menu align={isMobile ? "start" : "end"}>
            {isLogged ? (
              <>
                <Dropdown.Item href="#">Profile</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Item href="#">Logout</Dropdown.Item>
              </>
            ) : (
              <>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
                <Dropdown.Item href="/register">Register</Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
