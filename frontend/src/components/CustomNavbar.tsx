import React, { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import userIdAtom from "../atoms/userIdAtom";
import { useAtom } from "jotai";
import { useNavigate, useLocation } from "react-router-dom";

import "../pages/OpenAnimation.css";
import pokeball from "../assets/individual_pokeball.svg";

interface CustomNavbarProps {
  setNavbarExpanded: (expanded: boolean) => void;
}

const CustomNavbar: React.FC<CustomNavbarProps> = ({ setNavbarExpanded }) => {
  const [username, setUsername] = useAtom(userIdAtom);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [messageCount, setMessageCount] = useState(0);
  const [balance,] = useState(0);
  const [canClaim,] = useState(false);

  const handleLogout = () => {
    setUsername("");
    navigate("/");
  };
 
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("location:", location.pathname);
  }, [location]);

  useEffect(() => {
    if (username) {
      fetch(`${import.meta.env.VITE_API_URL}/api/messages/${username}/count`)
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

  // useEffect(() => {
  //   if (username) {
  //     fetch(`http://localhost:8000/user/${username}`)
  //       .then((response) => {
  //         if (!response.ok) {
  //           throw new Error("Network response was not ok");
  //         }
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log("Wallet data:", data);
  //         setBalance(data.wallet_balance);
  //         setCanClaim(data.can_claim);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data:", error);
  //         alert("Error fetching user data");
  //       });
  //   }
  // }, [username]);

  return (
    <Navbar bg="transparent" className="shadow-sm" expand="lg" onToggle={(expanded) => setNavbarExpanded(expanded)}>
      <Navbar.Brand style={{ paddingLeft: "20px" }} href="/">
        Pokétrade
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            style={{
              color: location.pathname === "/marketplace" ? "black" : "#513639",
            }}
            href="/marketplace"
          >
            Marketplace
          </Nav.Link>
          <Nav.Link
            style={{
              color: location.pathname === "/trade" ? "black" : "#513639",
            }}
            href="/trade"
          >
            Trade
          </Nav.Link>
          <Nav.Link
            style={{
              color: location.pathname === "/store" ? "black" : "#513639",
            }}
            href="/store"
          >
            Store
          </Nav.Link>
          {canClaim && location.pathname != "/loginrewards" && username && (
            <img
              className="blinking-image"
              src={pokeball}
              onClick={() => navigate("/loginrewards")}
              alt="Login Reward"
              style={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
                marginLeft: "10px",
                marginTop: "3px",
              }}
            />
          )}
        </Nav>
        <div style={{ marginRight: "12px" }}>
          {username && (
            <span className="welcome-message" style={{ marginRight: "15px", fontWeight: "bold" }}>
              {username} : <span className="text-muted">${balance.toFixed(2)}</span>
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
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
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
