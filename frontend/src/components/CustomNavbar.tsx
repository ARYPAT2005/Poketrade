import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import userIdAtom from "../atoms/userIdAtom";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

interface CustomNavbarProps {
  setNavbarExpanded: (expanded: boolean) => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ setNavbarExpanded }) => {
  const [username, setUsername] = useAtom(userIdAtom);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [messageCount, setMessageCount] = useState(0);

  const handleLogout = () => {
    setUsername("");
    navigate("/");
  };

  const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (username) {
      fetch(`http://localhost:8000/api/messages/${username}/count`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setMessageCount(data.unread_count);
        })
        .catch((error) => {
          console.error("Error fetching message count:", error);
        });
    }
  }),
    [username];
  return (
    <Navbar bg="transparent" className="shadow-sm" expand="lg" onToggle={(expanded) => setNavbarExpanded(expanded)}>
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
          {username && (
            <span className="welcome-message" style={{ marginRight: "15px", fontWeight: "bold" }}>
              Welcome {username}!
            </span>
          )}
          <a href="./Search">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="black"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </a>
        </div>
        <Dropdown style={{ marginRight: "10px" }}>
          <Dropdown.Toggle id="dropdown-basic" variant="outline-dark">
            <PersonCircle />
          </Dropdown.Toggle>
          <Dropdown.Menu align={isMobile ? "start" : "end"}>
            {username ? (
              <>
                <Dropdown.Item href="/messages">
                  Messages
                  {messageCount > 0 && (
                    <span style={{ float: "right", paddingBottom: "2px" }} className="badge bg-danger">
                      {messageCount >= 100 ? "99+" : messageCount}
                    </span>
                  )}
                </Dropdown.Item>
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
