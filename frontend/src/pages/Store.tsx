import React from "react";
import "./Store.css"; // Import your CSS file for styling

import { userIdAtom } from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";

import { Carousel } from "react-bootstrap";

import LoginPrompt from "./LoginPrompt";

import Pack from "../types/Pack";

import pokeball from "../assets/individual_pokeball.svg";

import PackDetails from "../components/PackDetails";

const Store: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [selectedPack, setSelectedPack] = React.useState<Pack | null>(null);

  const packs: Pack[] = [
    {
      id: "rare_ultra",
      name: "Rare Ultra",
      color: "#ffcc00", // Gold
      desc: `This pack has the following drop rates: \n
             65% chance to return a random card with rarity Common \n
             25% chance to return a random card with rarity Uncommon \n
             10% chance to return a random card with rarity Rare Ultra \n`,
      cost: 100,
    },
    {
      id: "rare_shiny",
      name: "Rare Shiny",
      color: "#ff6666", // Red
      desc: `This pack has the following drop rates: \n
             65% chance to return a random card with rarity Common \n
             25% chance to return a random card with rarity Uncommon \n
             10% chance to return a random card with rarity Rare Shiny \n`,
      cost: 150,
    },
    {
      id: "rare_holo",
      name: "Rare Holo",
      color: "#3399ff", // Blue
      desc: `This pack has the following drop rates: \n
             65% chance to return a random card with rarity Common \n
             25% chance to return a random card with rarity Uncommon \n
             10% chance to return a random card with rarity Rare Holo \n`,
      cost: 200,
    },
  ];

  const handlePackSelect = (pack: Pack) => {
    setSelectedPack(pack);
  };

  const handleCloseOverlay = () => {
    setSelectedPack(null);
  };

  return (
    <div>
      <h1>Store</h1>
      {userId ? (
        <div>
          <Carousel
            interval={3000} // Change slide every 3 seconds
            indicators={true} // Show indicators
            controls={true} // Show previous/next controls
            style={{
              width: "min(600px, 90%)",
              margin: "auto",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {packs.map((pack, index) => (
              <Carousel.Item key={index} onClick={() => handlePackSelect(pack)} style={{ cursor: "pointer" }}>
                <div
                  style={{
                    backgroundColor: pack.color,
                    padding: "20px",
                    borderRadius: "10px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={pokeball}
                    alt="Pokeball"
                    style={{ width: "200px", height: "200px", marginBottom: "10px" }}
                  />
                  <h3>{pack.name}</h3>
                  <p>Trade for a chance to get {pack.name} cards!</p>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
          {selectedPack && <PackDetails pack={selectedPack} onClose={handleCloseOverlay} />}
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Store;
