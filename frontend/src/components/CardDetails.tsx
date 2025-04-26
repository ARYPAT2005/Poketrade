import React, { useRef, useEffect } from "react";
import Card from "../types/Card";

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
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
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          maxWidth: "500px",
          width: "800px",
          background: "white",
        }}
        ref={cardDetailRef}
      >
        <button onClick={onClose}>Close</button>
        <h2>{card.name}</h2>
        <img src={card.image_url} alt={card.name} width="300" />
        <p>Supertype: {card.supertype}</p>
        <p>HP: {card.hp}</p>
        <p>Rarity: {card.rarity ?? "Unknown"}</p>
      </div>
    </div>
  );
};

export default CardDetail;
