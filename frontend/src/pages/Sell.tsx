import React, { useState, useEffect } from "react";
import "./Sell.css";
import { useAtomValue } from "jotai";
import userIdAtom from "../atoms/userIdAtom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Card from "../types/Card";

type OwnedCards = {
  card_details: Card;
  quantity: number;
  id: number;
  is_selling: boolean;
}

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

  const [ownedCards, setOwnedCards] = useState<OwnedCards[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  // neither were being used so commented it out:
  // const [selectedSell, setSelected] = useState<string | null>(null);
  const [auctionPrice, setAuctionPrice] = useState<string>("");
  const [buyNowPrice, setBuyNowPrice] = useState<string>("");
  const [sellMessage, setSellMessage] = useState<string | null>(null);
  const userId = useAtomValue(userIdAtom);
  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const [sellingCardIds, setSellingCardIds] = useState<Set<string>>(new Set());
  const [listedCardIds, setListedCardIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) {
      fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("User data in Sell:", data);
          setOwnedCards(data.owned_cards);
        })
        .catch((error) => {
          console.error("Error fetching user data in Sell:", error);
          alert("Error fetching your cards for selling.");
        });
    }
  }, [userId]);

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

    if (sellingCardIds.has(selectedCardId) || listedCardIds.has(selectedCardId)) {
      return;
    }

    const auctionPriceValue = parseFloat(auctionPrice);
    const buyNowPriceValue = parseFloat(buyNowPrice);

    const payload = {
      seller: userId,
      card: selectedCardId,
      auction_price: auctionPriceValue,
      buy_price: buyNowPriceValue,
    };
    console.log("Payload being sent:", payload);
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/sell/`;

    setSellingCardIds((prev) => new Set(prev).add(selectedCardId));

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Response is not okay.");
           throw new Error("Failed to sell card");
        }
        
        const contentType = res.headers.get("content-type");
        const contentLength = res.headers.get("content-length");
        
        if (res.status === 204 || contentLength === '0' || !contentType || !contentType.includes("application/json")) {
            return null; 
        } else {
            return res.json();
        }
      })
      .then((data) => {
        console.log("Sell success:", data);
        if (!isLocalhost) {
          setSellMessage("Your card has been listed for sale!");
        }
        setAuctionPrice("");
        setBuyNowPrice("");
        setSelectedCardId(null);
        setSelectedImage(null);
        setListedCardIds(prev => new Set(prev).add(selectedCardId));
        setSellingCardIds((prev) => {
          const next = new Set(prev);
          next.delete(selectedCardId);
          return next;
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong");
        setSellingCardIds((prev) => {
          const next = new Set(prev);
          next.delete(selectedCardId);
          return next;
        });
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
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={handleSell}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
        <Slider {...settings} className="slider">
        {ownedCards.filter(card => {
          console.log(card.is_selling);
          return card.is_selling;
        }).map((ownedCard) => (
          <div key={ownedCard.id}>
            <img
              src={ownedCard.card_details.image_url}
              alt={ownedCard.card_details.name}
              className="card-img"
              onClick={() => handleImageClick(ownedCard.card_details.image_url, ownedCard.card_details.id)}
            />
          </div>
        ))}

        </Slider>
      </div>
        
    </>
  );
};

export default Sell;
