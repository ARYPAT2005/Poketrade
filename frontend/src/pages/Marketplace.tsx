import React from "react";

import './Marketplace.css';
import pokemonImage from "../assets/pokemon.png";
import { isLoggedAtom } from "../atoms/isLoggedAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";
const Marketplace = () => {
  const isLogged = useAtomValue(isLoggedAtom);
  return (
    <div>
      <h1>Marketplace</h1>
        {isLogged ? (
          <>
            <p style={{textAlign: "center", color: "#DADADA"}}>Buy and sell items here!</p> 
            <div className = "container">
              <div className = "marketplace-container">
                {/* insert for loop here when trades have ids*/}
                <div className="card" style={{ width: "18rem" }}>
                  <img src={pokemonImage} className="card-img-top" alt="..."/>
                  <div className="card-body">
                    <h5 className="card-title">Trade</h5>
                    <p className="card-text">Trade for this pokemon.</p>
                    <a href="#" className="btn btn-primary">Trade</a>
                  </div>
                </div>
              </div>
            </div>


          </> 
        ) : <LoginPrompt />}
    </div>
  );
};

export default Marketplace;
