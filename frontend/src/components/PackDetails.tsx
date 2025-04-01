import React from "react";
import Card from "../types/Card";

import pokeball from "../assets/individual_pokeball.svg";
import Pack from "../types/Pack";
interface CardDetailProps {
  pack: Pack;
  onClose: () => void;
}

const PackDetails: React.FC<CardDetailProps> = ({ pack, onClose }) => {
  return (
    <div className="overlay">
      <div
        className="card-detail"
        style={{
          backgroundColor: pack.color || "#fff",
        }}
      >
        <button onClick={onClose}>Close</button>
        <h2>{pack.name}</h2>
        <img
          className="blinking-image"
          src={pokeball}
          alt="Pokeball"
          width="300"
          onClick={onClose}
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
          {pack.desc}
        </p>
      </div>
    </div>
  );
};

export default PackDetails;
