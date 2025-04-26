import React, { useState, useEffect } from "react";
import "./Marketplace.css";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue, useAtom } from "jotai";
import Card from "../types/Card";
import { useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import userAtom from "../atoms/userAtom";

interface MarketplaceItem {
  id: number;
  card: Card;
  buy_price: string;
  auction_price: string;
  seller: string | null;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([]);
  const [maxPriceHP, setMaxPriceHP] = useState(1000);
  const [maxPossibleHP, setMaxPossibleHP] = useState(1000);
  const [maxBuyPrice, setMaxBuyPrice] = useState(1000);
  const [maxPossibleBuyPrice, setMaxPossibleBuyPrice] = useState(1000);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const userId = useAtomValue(userIdAtom);
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [showNoFundsAlert, setShowNoFundsAlert] = useState(false);
  const [noFundsMessage, setNoFundsMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [user, setUser] = useAtom(userAtom);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = (itemId: number) => {
    setBidAmount("");
    setBidError("");
    setShowNoFundsAlert(false);
    setNoFundsMessage("");
  };

  const handleCloseOverlay = () => {
    setShowNoFundsAlert(false);
    setNoFundsMessage("");
  };

  const handleRarityChange = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity) ? prev.filter((r) => r !== rarity) : [...prev, rarity]
    );
  };

  const handClick = () => {
    navigate("/sell");
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/marketplace/`)
      .then((response) => response.json())
      .then((data: MarketplaceItem[]) => {
        setMarketplaceItems(data);
        let maxHP = 0;
        let maxBuy = 0;
        data.forEach((item) => {
          const itemHP = parseInt(item.card.hp || "0", 10);
          const buyPrice = parseFloat(item.buy_price);
          if (itemHP > maxHP) maxHP = itemHP;
          if (!isNaN(buyPrice) && buyPrice > maxBuy) maxBuy = buyPrice;
        });
        setMaxPossibleHP(maxHP);
        setMaxPriceHP(maxHP);
        setMaxPossibleBuyPrice(maxBuy);
        setMaxBuyPrice(maxBuy);
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
        (card.rarity && selectedRarities.some((selectedRarity) =>
          card.rarity.startsWith(selectedRarity)
        ));
      const hp = parseInt(card.hp || "0", 10);
      const matchesHP = hp <= maxPriceHP;
      const buyPrice = parseFloat(item.buy_price);
      const matchesBuyPrice = isNaN(buyPrice) || buyPrice <= maxBuyPrice;
      return matchesName && matchesRarity && matchesHP && matchesBuyPrice;
    });
    setFilteredItems(filtered);
    console.log("filteredItems after filter:", filtered);
  }, [searchQuery, selectedRarities, marketplaceItems, maxPriceHP, maxBuyPrice]);

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

    if (bid > (user?.wallet_balance || 0)) { // Use 0 as default in case user is undefined
      setBidError("You do not have enough coins to place this bid.");
      return;
    }

    console.log(`Bid of ${bid} placed on item ${item.id}`);
    setUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, wallet_balance: prevUser.wallet_balance - bid };
      }
      return null;
    });
    handleCloseOverlay();
  };

  const buyItem = async (item: MarketplaceItem) => {
    const itemPrice = parseFloat(item.buy_price);

    if (isNaN(itemPrice)) {
      setNoFundsMessage("Invalid price for the item.");
      setShowNoFundsAlert(true);
      return;
    }
    if (user?.wallet_balance < itemPrice) {
      setNoFundsMessage(
        `You do not have enough coins to buy this item.  You have ${user?.wallet_balance}.`
      );
      setShowNoFundsAlert(true);
      return;
    }

    try {
      console.log("Buying item.");
      console.log(`${import.meta.env.VITE_API_URL}`);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/marketplace/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: item.id, buyer: userId }),
      });

      if (!response.ok) {
        console.error("Failed to Buy Item - Error ");
        console.log("Buyer: ", userId);
        console.error("Item Payload:", JSON.stringify(item));
        setNoFundsMessage("Failed to complete purchase.");
        setShowNoFundsAlert(true);
      } else {
        console.log("Bought item successfully");
        setUser((prevUser) => {
          if (prevUser) {
            return { ...prevUser, wallet_balance: prevUser.wallet_balance - itemPrice };
          }
          return null;
        });

        setMarketplaceItems((prevItems) =>
          prevItems.filter((marketItem) => marketItem.id !== item.id)
        );
        setShowNoFundsAlert(false);
        setNoFundsMessage("");
      }
    } catch (error) {
      console.error("Error buying item:", error);
      setNoFundsMessage("An error occurred during purchase. Please try again.");
      setShowNoFundsAlert(true);
    }
  };

  return (
    <div>
      <h1>Marketplace</h1>
      {showNoFundsAlert && (
        <Alert variant="danger" onClose={() => setShowNoFundsAlert(false)} dismissible>
          <Alert.Heading>Purchase Failed!</Alert.Heading>
          <p>{noFundsMessage}</p>
        </Alert>
      )}
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
          <div className={isMobile ? "filter-word-mobile" : "filter-word"}>
            Filters
          </div>
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
                <span>Buy Price</span>
              </div>
              <input
                type="range"
                min="0"
                max={maxPossibleBuyPrice}
                value={maxBuyPrice}
                onChange={(e) => setMaxBuyPrice(Number(e.target.value))}
                className="thumb thumb-right"
                onInput={(e) => setMaxBuyPrice(Number(e.target.value))}
              />
              <div className="price-values">
                <span>{maxBuyPrice} Coins</span>
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
              max={maxPossibleHP}
              value={maxPriceHP}
              onChange={(e) => setMaxPriceHP(Number(e.target.value))}
              className="thumb thumb-right"
              onInput={(e) => setMaxPriceHP(Number(e.target.value))}
            />
            <div className="price-values">
              <span>{maxPriceHP} HP</span>
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#DADADA" }}>
          Buy and sell items here!
        </p>

        <div className="container">
          <div className="marketplace-container">
            {filteredItems.map((item) => (
              <a href="#" onClick={(e) => e.preventDefault()} key={item.id}>
                <div className="card">
                  <img
                    src={item.card.image_url}
                    className="card-img-top"
                    alt={item.card.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.card.name}</h5>
                    <p>Seller: {item.seller || "N/A"}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        buyItem(item);
                      }}
                    >
                      Buy: {item.buy_price}
                    </button>
                  </div>
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

