import React, { useEffect, useState, useRef } from "react";
import Card from "../types/Card";
import userAtom from "../atoms/userAtom";
import { useAtom } from "jotai";

import pokeball from "../assets/individual_pokeball.svg";
import Pack from "../types/Pack";
interface CardDetailProps {
  pack: Pack;
  onClose: () => void;
}

const PackDetails: React.FC<CardDetailProps> = ({ pack, onClose }) => {
  const [user, setUser] = useAtom(userAtom);
  const [cardWon, setCardWon] = useState<Card | null>(null);
  const cardDetailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardDetailRef.current && !cardDetailRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handlePackOpen = () => {
    if (!user) {
      console.error("User not found");
      return;
    }
    if (user.wallet_balance < pack.cost) {
      alert("You don't have enough coins to open this pack.");
      return;
    }
    console.log("pack", pack);
    fetch(`${import.meta.env.VITE_API_URL}/api/packs/${pack.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user.username,
        cost: pack.cost,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setCardWon(data);
        }
      })
      .catch((error) => {
        console.error("Error opening pack:", error);
        alert("Failed to open the pack. Please try again later.");
      });
  };

  return (
    <div className="overlay">
      <div
        className="card-detail"
        style={{
          backgroundColor: pack.color || "#fff",
        }}
        ref={cardDetailRef}
      >
        <button onClick={onClose}>Close</button>
        <h2>{pack.name}</h2>
        {cardWon ? (
          <div>
            <h3>Congrats! You got a: {cardWon.name}</h3>
            <img src={cardWon.image_url} alt={cardWon.name} width="300" />
            <p>Supertype: {cardWon.supertype}</p>
            <p>HP: {cardWon.hp}</p>
            <p>Rarity: {cardWon.rarity}</p>
          </div>
        ) : (
          <div>
            <img
              className="blinking-image"
              src={pokeball}
              alt="Pokeball"
              width="300"
              onClick={handlePackOpen}
              style={{
                cursor: "pointer",
              }}
            />

            <p>
              <strong>Pack Cost:</strong> {pack.cost} coins
            </p>
            <p
              style={{
                whiteSpace: "pre-wrap", // Preserve whitespace for formatting
                marginTop: "20px",
              }}
            >
              {pack.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackDetails;
