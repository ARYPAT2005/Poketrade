import React, { useState, useEffect } from 'react';

import './Marketplace.css';
import pokemonImage from "../assets/pokemon.png";
import { isLoggedAtom } from "../atoms/isLoggedAtom";
import { useAtomValue } from "jotai";

import LoginPrompt from "./LoginPrompt";

const Marketplace = () => {
  const [overlayIsVisible, setOverlayVisibility] = useState<{ [key:number]: boolean}>({});
  
  const handleCardClick = (cardId: number) => {
    setOverlayVisibility((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  useEffect(() => {
    
  }, []); 
  
  const minValue = 500;
  const isLogged = useAtomValue(isLoggedAtom);
  return (
    <div>
      <h1>Marketplace</h1>
        {isLogged ? (
          <>
            <p style={{textAlign: "center", color: "#DADADA"}}>Buy and sell items here!</p> 
            <div className = "container">
              <div className = "marketplace-container">
                {[...Array(5)].map((_, cardId) => (
                  /* insert for loop here when trades have ids*/
                  <a href="#" onClick={(e) => e.preventDefault()} key = {cardId}>
                    <div className="card" onClick={() => handleCardClick(cardId)}>
                      <img src={pokemonImage} className="card-img-top" alt="..."/>
                      <div className="card-body">
                        <h5 className="card-title">Charizard</h5>
                        <p> Buy: $1000 </p>
                        <p> Auction: {minValue}</p>
                      </div>
                      {/* Show overlay when card is clicked */}
                      {overlayIsVisible[cardId] && <div className="overlay">Overlay Content</div>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </> 
        ) : <LoginPrompt />}
    </div>
  );
};

export default Marketplace;
