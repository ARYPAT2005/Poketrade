import React, { useState, useEffect } from "react";
import "./Sell.css";
import { useAtomValue } from "jotai";
import userIdAtom from "../atoms/userIdAtom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../types/Card";

const Sell: React.FC = () => {
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [auctionPrice, setAuctionPrice] = useState<string>("");
  const [buyNowPrice, setBuyNowPrice] = useState<string>("");
  const [sellMessage, setSellMessage] = useState<string | null>(null);
  const userId = useAtomValue(userIdAtom);
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  useEffect(() => {
    fetch("http://localhost:8000/api/cards/?page=1")
      .then((response) => response.json())
      .then((data) => {
        setCards(data.results);
      })
      .catch((error) => console.error("Error fetching cards:", error));
  }, []);

  const handleImageClick = (imageUrl: string, cardId: string) => {
    setSelectedImage(imageUrl);
    setSelectedCardId(cardId);
    setSellMessage(null);
  };

  const handleSell = () => {
    if (!selectedCardId) {
      alert("Please select a card.");
      return;
    }

    const auctionPriceValue = parseFloat(auctionPrice);
    const buyNowPriceValue = parseFloat(buyNowPrice);

    if (isNaN(auctionPriceValue) || isNaN(buyNowPriceValue)) {
      alert("Please enter valid numbers for starting bid and buy now price.");
      return;
    }

    if (auctionPriceValue > buyNowPriceValue) {
      alert("Starting bid cannot be greater than the buy now price.");
      return;
    }

    const payload = {
      seller: userId,
      card: selectedCardId,
      auction_price: auctionPriceValue,
      buy_price: buyNowPriceValue,
    };

    const apiUrl = isLocalhost ? `${import.meta.env.VITE_API_URL}/api/sell/` : "/api/sell/";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Response is not okay.")
          throw new Error("Failed to sell card");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Sell success:", data);
        if (!isLocalhost) {
          setSellMessage("Your card has been listed for sale!");
        } else {
          alert("Card listed for sale!");
        }
        setAuctionPrice("");
        setBuyNowPrice("");
        setSelectedCardId(null);
        setSelectedImage(null);
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong");
      });
  };

  return (
    <>
      <h1>Sell</h1>
      <div className="Outline">
        <div className="cardSell">
          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="image" />
          )}
          {sellMessage && <p className="sell-success-message">{sellMessage}</p>}
        </div>

        <div className="sell">
          <div className="flex-container">
            <div><p>Starting Bid:</p></div>
            <div>
              <input
                type="text"
                placeholder="Type here..."
                className="inputBox"
                value={auctionPrice}
                onChange={(e) => setAuctionPrice(e.target.value)}
              />
            </div>
            <div><p>Buy Now:</p></div>
            <div>
              <input
                type="text"
                placeholder="Type here..."
                className="inputBox"
                value={buyNowPrice}
                onChange={(e) => setBuyNowPrice(e.target.value)}
              />
            </div>
            <div>
              <button
                type="button"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                onClick={handleSell}
              >
                Sell
              </button>
            </div>
          </div>
        </div>

        <Slider {...settings} className="slider">
          {cards.map((card) => (
            <div key={card.id}>
              <img
                src={card.image_url}
                alt={card.name}
                className="card-img"
                onClick={() => handleImageClick(card.image_url, card.id)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Sell;