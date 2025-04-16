import { useState, useEffect } from "react";

import "./Marketplace.css";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import Card from "../types/Card";
import LoginPrompt from "./LoginPrompt";
import { useNavigate } from 'react-router-dom';


const Marketplace = () => {
  const [overlayIsVisible, setOverlayVisibility] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const userId = useAtomValue(userIdAtom);
  const minValue = 500;
  const navigate = useNavigate();


  const handleCardClick = (cardId: string) => {
    setOverlayVisibility(prevId => prevId === cardId ? null : cardId);
  };

  const handleCloseOverlay = () => {
    setOverlayVisibility(null);
  };

  const handleRarityChange = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };
  const handClick = () => {
    navigate('/sell');
  };

  useEffect(() => {
    // Replace URL with page containing list of trades.
    fetch(`${import.meta.env.VITE_API_URL}/api/cards/?page=1`)
      .then((response) => response.json())
      .then((data) => {
        setCards(data.results);
      })
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);

  useEffect(() => {
    const filtered = cards.filter((card) => {
      const matchesName = card.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim());
      const matchesRarity =
        selectedRarities.length === 0 ||
        (card.rarity && selectedRarities.includes(card.rarity));
      const hp = parseInt(card.hp || "0", 10);
      const matchesHP = hp >= minPrice && hp <= maxPrice;

      return matchesName && matchesRarity && matchesHP;
    });

    setFilteredCards(filtered);
  }, [searchQuery, selectedRarities, cards, minPrice, maxPrice]);

  return (
    <div>
      <h1>Marketplace</h1>
      {userId ? (
        <>
            <div className="filter">
            <div className="filterWord">Filters</div>
            <div className="buttonBox">
            <div className="Rarity">Rarity</div>
            <div className="categories">
                {[
                  "Uncommon",
                  "Common",
                  "Rare",
                  "Legend"
                ].map((rarity, i) => (
                  <div className="flex items-center w-48" key={i}>
                    <span className="text-lg font-bold me-2">{rarity}</span>
                    <input
                      type="checkbox"
                      checked={selectedRarities.includes(rarity)}
                      onChange={() => handleRarityChange(rarity)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="price-slider-container">
              <label className="price-label">HP</label>
              <div className="slider-track">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="thumb thumb-left"
                />
                <div className="price-values">
                  <span>{minPrice} HP</span>
                </div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "#DADADA" }}>
            Buy and sell items here!
          </p>

          <div className="search">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sell">
          <button onClick={handClick} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Sell</button>
          </div>


          <div className="container">
            <div className="marketplace-container">
              {filteredCards.map((card) => (
                <a href="#" onClick={(e) => e.preventDefault()} key={card.id}>
                  <div
                    className="card"
                    onClick={() => handleCardClick(card.id)}
                  >
                    <img
                      src={card.image_url}
                      className="card-img-top"
                      alt={card.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{card.name}</h5>
                      <p>HP: {card.hp || "N/A"}</p>
                      <p>Auction: {minValue}</p>
                    </div>

                    {overlayIsVisible === card.id && (
                      <div className="overlays">
                        <div className="Buy">
                          <div>Buy:</div>
                          <div className="Coins">Coins: 1000</div>
                          <div className="X">
                            <button
                              type="button"
                              className="btn-close"
                              aria-label="Close"
                              onClick={handleCloseOverlay}
                            ></button>
                          </div>

                          <div className="buycard">
                            <img
                              src={card.image_url}
                              style={{ width: "300px", height: "auto" }}
                              alt={card.name}
                            />
                            <div className="timer">24:00</div>
                          </div>
                          <div className="BidAmount">Set Bid Amount</div>
                          <button type="button" className="btn btn-light">
                            Light
                          </button>
                        </div>
                        <div className="status">
                          Stats:
                          <p>HP: {card.hp || "N/A"}</p>
                          {card.types && card.types.length > 0 && (
                            <p>Types: {card.types.join(", ")}</p>
                          )}
                          {card.evolves_from && <p>Evolves From: {card.evolves_from}</p>}
                          {card.abilities && card.abilities.length > 0 && (
                            <div>
                              Abilities:
                              <ul>
                                {card.abilities.map((ability, index) => (
                                  <li key={index}>
                                    {ability.name}: {ability.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {card.attacks && card.attacks.length > 0 && (
                            <div>
                              Attacks:
                              <ul>
                                {card.attacks.map((attack, index) => (
                                  <li key={index}>
                                    {attack.name}: {attack.damage || "N/A"}
                                    {attack.cost && attack.cost.length > 0 && (
                                      <span> (Cost: {attack.cost.join(", ")})</span>
                                    )}
                                    {attack.text && <span> - {attack.text}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {card.weaknesses && card.weaknesses.length > 0 && (
                            <p>Weaknesses: {card.weaknesses.map((weakness) => `${weakness.type} ${weakness.value}`).join(", ")}</p>
                          )}
                          {card.resistances && card.resistances.length > 0 && (
                            <p>Resistances: {card.resistances.map((resistance) => `${resistance.type} ${resistance.value}`).join(", ")}</p>
                          )}
                          {card.set_data && <p>Set: {card.set_data.name} ({card.set_data.series})</p>}
                          <p>Number: {card.number}</p>
                          {card.rarity && <p>Rarity: {card.rarity}</p>}
                          {card.artist && <p>Artist: {card.artist}</p>}
                        </div>
                      </div>
                    )}
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