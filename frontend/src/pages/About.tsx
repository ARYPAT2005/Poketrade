import React, { useEffect, useState } from "react";
import Card from "../types/Card";
import CardDetail from "../components/CardDetails";
const About: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cards/?page=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.results) {
          console.log(data);
          const card = data.results.map((cardData: any) => {
            return {
              id: cardData.id,
              name: cardData.name,
              image_url: cardData.image_url,
              supertype: cardData.supertype || "",
              subtypes: cardData.subtypes || [],
              hp: cardData.hp || null,
              types: cardData.types || null,
              evolves_from: cardData.evolves_from || null,
              abilities: cardData.abilities || null,
              attacks: cardData.attacks || null,
              weaknesses: cardData.weaknesses || null,
              resistances: cardData.resistances || null,
              set_data: cardData.set_data || {},
              number: cardData.number || "",
              rarity: cardData.rarity || null,
              legalities: cardData.legalities || null,
              artist: cardData.artist || null,
              updated_at: cardData.updated_at || new Date().toISOString(),
              tcgplayer_url: cardData.tcgplayer_url || null,
            } as Card;
          });

          setCards(card);
        } else {
          console.error("No card data found in the response");
        }
      })
      .catch((error) => console.error("Error fetching card:", error));
  }, []);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleCloseOverlay = () => {
    setSelectedCard(null);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1>About PokéTrade</h1>
        <p
          style={{
            textAlign: "center",
            width: "50%",
          }}
        >
          PokéTrade is a web application where users can collect, trade, and manage Pokémon in a fun and interactive
          way. The idea is to create a simple experience, similar to collectible card games, but with a focus on trading
          instead of complex battles.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {cards.map((card) => (
          <img
            key={`${card.id}-${card.name}`}
            src={card.image_url}
            alt={card.name}
            width="300"
            style={{
              cursor: "pointer",
              margin: "10px",
            }}
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
      {selectedCard && <CardDetail card={selectedCard} onClose={handleCloseOverlay} />}
    </>
  );
};

export default About;
