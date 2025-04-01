import React from "react";
import Card from "../types/Card";

interface CardDetailProps {
  card: Card;
  onClose: () => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, onClose }) => {
  return (
    <div className="overlay">
      <div className="card-detail">
        <button onClick={onClose}>Close</button>
        <h2>{card.name}</h2>
        <img src={card.image_url} alt={card.name} width="300" />
        <p>Supertype: {card.supertype}</p>
        <p>HP: {card.hp}</p>
        <p>Rarity: {card.rarity}</p>
        {/* Add more card details as needed */}
      </div>
    </div>
  );
};

export default CardDetail;
