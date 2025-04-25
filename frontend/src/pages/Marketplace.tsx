import React, { useState, useEffect } from "react";
import "./Marketplace.css";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import Card from "../types/Card";
import LoginPrompt from "./LoginPrompt";
import { useNavigate } from "react-router-dom";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';



interface MarketplaceItem {
  id: number;
  card: Card;
  buy_price: string;
  auction_price: string;
  seller: string | null;
}

const Marketplace = () => {
  const [overlayIsVisible, setOverlayVisibility] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [minPriceHP, setMinPriceHP] = useState(0);
  const [maxPriceHP, setMaxPriceHP] = useState(1000);
  const [minPriceAuction, setMinPriceAuction] = useState(0);
  const [maxPriceAuction, setMaxPriceAuction] = useState(1000);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const userId = useAtomValue(userIdAtom);
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [userCoins, setUserCoins] = useState(1500);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (itemId: number) => {
    setBidAmount("");
    setBidError("");
  };

  const handleCloseOverlay = () => {
    // ayVisibility(null);setOverl
    setBidAmount("");
    setBidError("");
  };

  const handleRarityChange = (rarity: string) => {
    setSelectedRarities((prev) => (prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]));
  };

  const handClick = () => {
    navigate("/sell");
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/marketplace/`)
      .then((response) => response.json())
      .then((data: MarketplaceItem[]) => {
        setMarketplaceItems(data);
        console.log("Fetched marketplace data:", data);
      })
      .catch((error) => console.error("Error fetching marketplace items:", error));
  }, []);

  useEffect(() => {
    console.log("marketplaceItems before filter:", marketplaceItems);
    const filtered = marketplaceItems.filter((item) => {
      const card = item.card;
      const matchesName = card.name.toLowerCase().startsWith(searchQuery.toLowerCase().trim());
      const matchesRarity =
        selectedRarities.length === 0 ||
        (card.rarity && selectedRarities.some((selectedRarity) => card.rarity.startsWith(selectedRarity)));
      const hp = parseInt(card.hp || "0", 10);
      const matchesHP = hp >= minPriceHP; // Ensure we are filtering for HP greater than or equal to the minimum
      const auctionPrice = parseFloat(item.auction_price);
      const matchesAuctionPrice = isNaN(auctionPrice) || (auctionPrice >= minPriceAuction && auctionPrice <= maxPriceAuction);

      return matchesName && matchesRarity && matchesHP && matchesAuctionPrice;
    });
    setFilteredItems(filtered);
    console.log("filteredItems after filter:", filtered);
  }, [searchQuery, selectedRarities, marketplaceItems, minPriceHP, maxPriceHP, minPriceAuction, maxPriceAuction]);

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBidAmount(e.target.value);
    setBidError("");
  };

  const handlePlaceBid = (item: MarketplaceItem) => {
    const bid = parseFloat(bidAmount);
    const auctionPrice = parseFloat(item.auction_price);

    if (isNaN(bid) || bid <= 0) {
      setBidError("Please enter a valid bid amount.");
      return;
    }

    if (bid <= auctionPrice) {
      setBidError("Your bid must be higher than the current auction price.");
      return;
    }

    if (bid > userCoins) {
      setBidError("You do not have enough coins to place this bid.");
      return;
    }

    console.log(`Bid of ${bid} placed on item ${item.id}`);
    setUserCoins((prevCoins) => prevCoins - bid);
    handleCloseOverlay();
  };
  const [auctionPriceRange, setAuctionPriceRange] = useState<number[]>([0, 100]); // State for the range

  const handleAuctionPriceChange = (values: number[]) => {
    setAuctionPriceRange(values);
    console.log('Auction Price Range:', values);
    // You would also update your filtering logic here
  };

  const buyItem = async(item: MarketplaceItem) => {
      try {
        console.log('Buying item.')
        console.log(`${import.meta.env.VITE_API_URL}`);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/marketplace/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'id': item.id, 'buyer': userId}),
        });

        if (!response.ok) {
            console.error("Failed to Buy Item - Error ");
            console.log("Buyer: ", userId);
            console.error("Item Payload:", JSON.stringify(item));
        } else {
            console.log("Bought item successfully");
        }
    } catch (error) {
        console.error("Error buying item:", error);
    }
  }

  return (
    <div>
      <h1>Marketplace</h1>
        <div>
          <div>
            <div
              className="float-end"
              style={{
                marginRight: "10px",
              }}
            >
              <button
                onClick={handClick}
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                Sell
              </button>
            </div>
            <div
              style={{
                width: "30%",
                marginLeft: "10px",
              }}
            >
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div
            className={isMobile ? "filter-mobile" : "filter"}
            style={{
              border: "2px solid red",
            }}
          >
            <div className={isMobile ? "filter-word-mobile" : "filter-word"}>Filters</div>
            <div className={isMobile ? "" : "buttonBox"}>
              <div className="Rarity">Rarity</div>
              <div className={isMobile ? "" : "categories"}>
                {["Uncommon", "Common", "Rare", "Legend"].map((rarity, i) => (
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

            <div className={isMobile ? "" : "price-slider-container"}>
              <div className={isMobile ? "" : "slider-track"}>
                <div className={isMobile ? "" : "price-values"}>
                  <span>Auction Price</span>
                  <RangeSlider></RangeSlider>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={maxPriceAuction}
                  onChange={(e) => setMaxPriceAuction(Number(e.target.value))}
                  className="thumb thumb-right"
                />
                <div className="price-values">
                  <span>{maxPriceAuction} Coins</span>
                </div>
              </div>
            </div>
            <div className={isMobile ? "" : "price-slider-container2"}>
              <div className="price-values">
                <span>HP</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={minPriceHP}
                onChange={(e) => setMinPriceHP(Number(e.target.value))}
                className="thumb thumb-left"
              />
              <div className="price-values">
                <span>{minPriceHP} HP</span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "#DADADA" }}>Buy and sell items here!</p>

          <div className="container">
            <div className="marketplace-container">
              {filteredItems.map((item) => (
                <a href="#" onClick={(e) => e.preventDefault()} key={item.id}>
                  <div className="card" onClick={() => handleCardClick(item.id)}>
                    <img src={item.card.image_url} className="card-img-top" alt={item.card.name} />
                    <div className="card-body">
                      <h5 className="card-title">{item.card.name}</h5>
                      <p>Seller: {item.seller || "N/A"}</p>

                      <button onClick={ () => buyItem(item) }>Buy: {item.buy_price}</button>
                    </div>

                    {overlayIsVisible === item.id && (
                      <div className="overlays">
                        <div className="Buy">
                          <div>Buy:</div>
                          <div className="Coins">Coins: {userCoins}</div>
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
                              src={item.card.image_url}
                              style={{ width: "300px", height: "auto" }}
                              alt={item.card.name}
                            />
                            <div className="timer">24:00</div>
                          </div>
                          <div className="BidAmount">Set Bid Amount</div>
                          <input
                            type="number"
                            className="form-control"
                            value={bidAmount}
                            onChange={handleBidChange}
                            placeholder={`Min. Bid: ${parseFloat(item.auction_price) + 1}`}
                          />
                          {bidError && <p className="error-message">{bidError}</p>}
                          <button type="button" className="btn btn-primary" onClick={() => handlePlaceBid(item)}>
                            Place Bid
                          </button>
                        </div>
                        <div className="status">
                          Stats:
                          <p>HP: {item.card.hp || "N/A"}</p>
                          {item.card.types && item.card.types.length > 0 && <p>Types: {item.card.types.join(", ")}</p>}
                          {item.card.evolves_from && <p>Evolves From: {item.card.evolves_from}</p>}
                          {item.card.abilities && item.card.abilities.length > 0 && (
                            <div>
                              Abilities:
                              <ul>
                                {item.card.abilities.map((ability, index) => (
                                  <li key={index}>
                                    {ability.name}: {ability.text}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.card.attacks && item.card.attacks.length > 0 && (
                            <div>
                              Attacks:
                              <ul>
                                {item.card.attacks.map((attack, index) => (
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
                          {item.card.weaknesses && item.card.weaknesses.length > 0 && (
                            <p>
                              Weaknesses:{" "}
                              {item.card.weaknesses.map((weakness) => `${weakness.type} ${weakness.value}`).join(", ")}
                            </p>
                          )}
                          {item.card.resistances && item.card.resistances.length > 0 && (
                            <p>
                              Resistances:{" "}
                              {item.card.resistances
                                .map((resistance) => `${resistance.type} ${resistance.value}`)
                                .join(", ")}
                            </p>
                          )}
                          {item.card.set_data && (
                            <p>
                              Set: {item.card.set_data.name} ({item.card.set_data.series})
                            </p>
                          )}
                          <p>Number: {item.card.number}</p>
                          {item.card.rarity && <p>Rarity: {item.card.rarity}</p>}
                          {item.card.artist && <p>Artist: {item.card.artist}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
};

export default Marketplace;