import { useState, useEffect } from "react";
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
  buy_price: string | null;
  auction_price: string | null;
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
    console.log(`Card with ID ${itemId} clicked.`);
  };


  const handleCloseOverlay = () => {
    setShowNoFundsAlert(false);
    setNoFundsMessage("");
  };
  // handleCloseOverlay wasn't being used
  console.log(handleCloseOverlay);

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
          const buyPrice = parseFloat(item.buy_price || "0"); 
          if (itemHP > maxHP) maxHP = itemHP;
          if (!isNaN(buyPrice) && buyPrice > maxBuy) maxBuy = buyPrice;
        });
        setMaxPossibleHP(maxHP || 1000);
        setMaxPriceHP(maxHP || 1000);
        setMaxPossibleBuyPrice(maxBuy || 1000);
        setMaxBuyPrice(maxBuy || 1000);
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
      const buyPrice = parseFloat(item.buy_price || "0");
      const matchesBuyPrice = isNaN(buyPrice) || buyPrice <= maxBuyPrice;
      return matchesName && matchesRarity && matchesHP && matchesBuyPrice;
    });
    setFilteredItems(filtered);
    console.log("filteredItems after filter:", filtered);
  }, [searchQuery, selectedRarities, marketplaceItems, maxPriceHP, maxBuyPrice]);

    
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
  if (userId === item.seller) {
    setNoFundsMessage("Can't buy your own card.");
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

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
       <div style={{ width: isMobile ? "60%" : "30%", marginLeft: "10px" }}>
         <input
           className="form-control mr-sm-2"
           type="search"
           placeholder="Search"
           aria-label="Search"
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
         />
       </div>
       <div style={{ marginRight: "10px" }}>
         <button
           onClick={handClick}
           type="button"
           className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
         >
           Sell
         </button>
       </div>
      </div>

      <div style={{
        display: isMobile ? "block" : "flex",
        gap: "20px",
        paddingLeft: isMobile ? "0px" : "20px",
      }}>

        <div style={{
           flex: isMobile ? "unset" : "0 0 250px",
           backgroundColor: "#ffffff",
           border: "2px solid red",
           borderRadius: "10px",
           padding: "20px",
           marginBottom: isMobile ? "20px" : "0px",
           display: "flex",
           flexDirection: "column",
           gap: "20px",
           alignSelf: "flex-start",
           paddingLeft: isMobile ? "5px" : "20px",
        }}>
          <h2 style={{ fontWeight: "bold", fontSize: "1.5rem" }}>Filters</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Rarity</div>
            {["Uncommon", "Common", "Rare", "Legend"].map((rarity, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", fontSize: "0.95rem" }}>
                <input
                  type="checkbox"
                  checked={selectedRarities.includes(rarity)}
                  onChange={() => handleRarityChange(rarity)}
                  className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded-sm focus:ring-blue-500"
                  style={{ marginRight: "8px" }}
                />
                {rarity}
              </label>
            ))}

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Max Buy Price</div>
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

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>Max HP</div>
              <input
                type="range"
                min="0"
                max={maxPossibleHP}
                value={maxPriceHP}
                onChange={(e) => setMaxPriceHP(Number(e.target.value))}
                className="thumb thumb-left"
              />
              <div style={{ fontSize: "0.9rem" }}>Max: {maxPriceHP} HP</div>
            </div>
          </div>
        </div>
        <div style={{
           flex: 1,
           backgroundColor: "#f5baba",
           borderRadius: "20px",
           padding: "20px",
        }}>
          <p style={{ textAlign: "center" }}>Buy and sell items here!</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}>
            {filteredItems.map((item) => (
              <div key={item.id} className="card">
                <img src={item.card.image_url} className="card-img-top" alt={item.card.name} />
                <div className="card-body">
                  <h5 className="card-title">{item.card.name}</h5>
                  <p>Seller: <a href={`/player/${item.seller}`}>{item.seller || "N/A"}</a></p>
                  {item.buy_price !== null && item.buy_price !== undefined && (
                      <div>
                          <p>Price: {item.buy_price} Coins</p>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation();
                                buyItem(item);
                              }}
                              
                            >
                              Buy: {item.buy_price}
                            </button>
                      </div>
                  )}
                  
                   {item.buy_price === null && item.auction_price !== null && item.auction_price !== undefined && (
                       <div>
                           <p>Current Bid: {item.auction_price} Coins</p>
                            {userId && item.seller && userId.toString() !== item.seller.toString() ? (
                             <button
                               onClick={() => handleCardClick(item.id)}
                               className="btn btn-secondary mt-2"
                             >
                                View Auction
                             </button>
                            ) : (
                               <p>{userId && item.seller && userId.toString() === item.seller.toString() ? 'Your Auction' : 'Seller N/A'}</p>
                            )}
                       </div>
                   )}
                   {item.buy_price === null && item.auction_price === null && (
                       <p>Price not available</p>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
