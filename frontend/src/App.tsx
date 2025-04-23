import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Store from "./pages/Store";
import Trade from "./pages/Trade";

import ReceivedOffer from "./pages/ReceivedOffer";
import SentOffer from "./pages/SentOffer";
import CompletedOffer from "./pages/CompletedOffer";
import Trade2 from "./pages/Trade2";


import Search from "./pages/Search";
import Messages from "./pages/Messages";
import Creator from "./pages/Creator";
import Battles from "./pages/Battles";

import Profile from "./pages/Profile";
import LoginRewards from "./pages/LoginRewards";
import ForgotPassword from "./pages/ForgotPassword";

import CustomNavbar from "./components/CustomNavbar";
import Footer from "./components/Footer";

import "./App.css";

const App: React.FC = () => {
  const [navbarExpanded, setNavbarExpanded] = useState(false);

  return (
    <div className="app-container">
      <CustomNavbar setNavbarExpanded={setNavbarExpanded} />
      <div className={`content ${navbarExpanded ? "navbar-expanded" : ""}`}>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/store" element={<Store />} />
          <Route path="/trade" element={<Trade />} />

           {/* Trading offer pages – temporary use */}
          <Route path="/received-offer" element={<ReceivedOffer />} />
          <Route path="/sent-offer" element={<SentOffer />} />
          <Route path="/completed-offer" element={<CompletedOffer />} />
          <Route path="/trade2" element={<Trade2 />} />


          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/creator" element={<Creator />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/loginrewards" element={<LoginRewards />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/battles" element={<Battles />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
