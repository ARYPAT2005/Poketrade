import React, { useState, useEffect } from "react";

import "./Marketplace.css";
import pokemonImage from "../assets/pokemon.png";
import { isLoggedAtom } from "../atoms/isLoggedAtom";
import { useAtomValue } from "jotai";
import Card from "../types/Card";
import LoginPrompt from "./LoginPrompt";

const Marketplace = () => {
  const [overlayIsVisible, setOverlayVisibility] = useState<{ [key: number]: boolean }>({});

  const handleCardClick = (tradeId: number) => {
    setOverlayVisibility((prevState) => ({
      ...prevState,
      [tradeId]: !prevState[tradeId],
    }));
  };

  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    // Replace URL with page containing list of trades.
    fetch("http://localhost:8000/api/cards/?page=1")
      .then((response) => response.json())
      .then((data) => setCards(data.results))
      .catch((error) => console.error("Error fetching card:", error));
  }, []);

  const minValue = 500;
  const isLogged = useAtomValue(isLoggedAtom);
  return (
    <div>
      <h1>Marketplace</h1>
      {isLogged ? (
        <>
          <p style={{ textAlign: "center", color: "#DADADA" }}>Buy and sell items here!</p>
          <div className="container">
            <div className="marketplace-container">
              {/* insert for loop here when trades have ids*/}
              {cards.map((card) => (
                <a href="#" onClick={(e) => e.preventDefault()} key={card.id}>
                  <div className="card" onClick={() => handleCardClick(parseInt(card.id))}>
                    <img src={card.image_url} className="card-img-top" alt="..." />
                    <div className="card-body">
                      <h5 className="card-title">{card.name}</h5>
                      <p> Buy: $1000 </p>
                      <p> Auction: {minValue}</p>
                    </div>
                    {/* Show overlay when card is clicked */}
                    {overlayIsVisible[parseInt(card.id)] && <div className="overlay">Overlay Content</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Marketplace;
