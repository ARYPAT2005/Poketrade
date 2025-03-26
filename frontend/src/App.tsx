import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Store from "./pages/Store";
import Trade from "./pages/Trade";

import CustomNavbar from "./components/CustomNavbar";
import Footer from "./components/Footer";

import { useAtom } from "jotai";
import { isLoggedAtom } from "./atoms/isLoggedAtom";

import "./App.css";

const App: React.FC = () => {
  const [isLogged] = useAtom(isLoggedAtom);
  const [navbarExpanded, setNavbarExpanded] = useState(false);

  return (
    <div className="app-container">
      <CustomNavbar isLogged={isLogged} setNavbarExpanded={setNavbarExpanded} />
      <div className={`content ${navbarExpanded ? "navbar-expanded" : ""}`}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
