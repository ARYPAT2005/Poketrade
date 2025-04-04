import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Store from "./pages/Store";
import Trade from "./pages/Trade";
import Search from "./pages/Search";
import Cards from "./pages/Cards";
import Messages from "./pages/Messages";

import CustomNavbar from "./components/CustomNavbar";
import Footer from "./components/Footer";

import { useAtom } from "jotai";
import { userIdAtom } from "./atoms/userIdAtom";
import { isLoggedAtom, isRegisteredAtom } from "./atoms/isLoggedAtom";

import "./App.css";

const App: React.FC = () => {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [isLogged] = useAtom(isLoggedAtom);
  const [isRegistered] = useAtom(isRegisteredAtom);
  const [navbarExpanded, setNavbarExpanded] = useState(false);

  return (
    <div className="app-container">
      <CustomNavbar userId={userId} setUserId={setUserId} setNavbarExpanded={setNavbarExpanded} />
      <div className={`content ${navbarExpanded ? "navbar-expanded" : ""}`}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
