import React from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

interface CustomNavbarProps {
  isLogged: boolean;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ isLogged }) => {
  return (
    <Navbar className="shadow-sm" expand="lg" fixed="top">
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
          {isLogged ? (
            <Dropdown.Menu align="end">
              <Dropdown.Item href="#">Profile</Dropdown.Item>
              <Dropdown.Item href="#">Settings</Dropdown.Item>
              <Dropdown.Item href="#">Logout</Dropdown.Item>
            </Dropdown.Menu>
          ) : (
            <Dropdown.Menu align="end">
              <Dropdown.Item href="/login">Login</Dropdown.Item>
              <Dropdown.Item href="/register">Register</Dropdown.Item>
            </Dropdown.Menu>
          )}
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
