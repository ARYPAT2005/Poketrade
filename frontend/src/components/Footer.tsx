import React from "react";
import { Navbar } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <Navbar style={{ maxHeight: "30px" }}>
      <Navbar.Text style={{ paddingLeft: "10px", paddingTop: "25px" }}>
        © 2025 Jerry Wang, Joshua Joseph, Aryan Patel, and Kush Sharma. Released under the MIT License.
      </Navbar.Text>
    </Navbar>
  );
};

export default Footer;
