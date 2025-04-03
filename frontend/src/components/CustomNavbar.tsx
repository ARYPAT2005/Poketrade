import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import { usernameAtom, isLoggedAtom, isRegisteredAtom } from "../atoms/isLoggedAtom"; 
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";


interface CustomNavbarProps {
  isLogged: boolean;
  isRegistered: boolean;
  setNavbarExpanded: (expanded: boolean) => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ setNavbarExpanded }) => {
  const [username, setUsername] = useAtom(usernameAtom); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [isLogged, setIsLogged] = useAtom(isLoggedAtom);
  const [isRegistered, setisRegistered] = useAtom(isRegisteredAtom);

  const navigate = useNavigate();
  console.log("Username from atom:", username);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const handleLogout = () => {
    setIsLogged(false);
    setisRegistered(false);
    setUsername(""); 
    navigate("/");
  };
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
        <div style={{ marginRight: "12px" }}>
        {isLogged && (
            <span className="welcome-message" style={{ marginRight: "15px", fontWeight: "bold" }}>
              Welcome {username}!
            </span>
          )}
          <a href ="./Search">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </a>
          
        </div>
        <Dropdown style={{ marginRight: "10px" }}>
          <Dropdown.Toggle id="dropdown-basic" variant="outline-dark">
            <PersonCircle />
          </Dropdown.Toggle>
          <Dropdown.Menu align={isMobile ? "start" : "end"}>
            {isLogged ? (
              <>
                <Dropdown.Item href="#">Profile</Dropdown.Item>
                <Dropdown.Item href="#">Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
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
