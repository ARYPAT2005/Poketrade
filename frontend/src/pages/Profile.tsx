import React, { useEffect, useState } from "react";

import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Card, ListGroup, Carousel } from "react-bootstrap";
import PokemonCard from "../types/Card";

import LoginPrompt from "./LoginPrompt";

import CardDetails from "../components/CardDetails";

type OwnedCard = {
  card_details: PokemonCard;
  quantity: number;
  id: number;
};

type User = {
  username: string;
  email: string;
  wallet_balance: number;
  last_claim_date: Date | null;
  can_claim: boolean;
  owned_cards: OwnedCard[];
};
const chunkArray = <T,>(array: T[], size: number): T[][] => {
  const chunkedArr: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArr.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
};

const Profile: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);

  const handleCardEnlarge = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseOverlay = () => {
    setSelectedCard(null);
  };
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
          console.log("User data:", data);
          setUser(data);
        })
        .catch((error) => {
          setUser(null);
          console.error("Error fetching user data:", error);
          alert("Error fetching user data");
        });
    }
  }, [userId]);

  const PROFILE_CARDS_PER_PAGE = 8;
  const chunkedProfileCards = user?.owned_cards ? chunkArray(user.owned_cards, PROFILE_CARDS_PER_PAGE) : [];

  return (
    <div>
      <h1>Your Profile</h1>
      {user ? (
        <Card
          className="profile-card-colored"
          style={{
            maxWidth: "min(1000px, 90%)",
            margin: "auto",
            marginTop: "50px",
          }}
        >
          <Card.Body>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Card.Title>Your Profile</Card.Title>
            </div>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <strong>Username:</strong> {user?.username}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Email:</strong> {user?.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Wallet Balance:</strong> ${user?.wallet_balance}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Last Rewards Claim Date:</strong>{" "}
                {user?.last_claim_date ? new Date(user.last_claim_date).toLocaleDateString() : "Never"}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Login Reward:</strong>{" "}
                {user?.can_claim ? (
                  <a href="/loginrewards" style={{ color: "green", textDecorationLine: "underline" }}>
                    Available
                  </a>
                ) : (
                  <span style={{ color: "red" }}>Not Available</span>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Deck:</strong>
                {chunkedProfileCards?.length > 0 ? (
                  <Carousel
                    interval={null}
                    indicators={chunkedProfileCards.length > 1}
                    controls={chunkedProfileCards.length > 1}
                  >
                    {chunkedProfileCards.map((cardChunk, index) => (
                      <Carousel.Item key={`profile-page-${index}`}>
                        <div
                          className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-3 p-2"
                          style={{ minHeight: "150px" }}
                        >
                          {cardChunk.map((owned_card) => (
                            <div
                              key={`${user?.username}-profile-${owned_card.id}`}
                              className="d-flex flex-column align-items-center profile-deck-card"
                            >
                              <img
                                src={owned_card.card_details.image_url}
                                alt={owned_card.card_details.name}
                                style={{
                                  height: "auto",
                                  marginBottom: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleCardEnlarge(owned_card.card_details)}
                                className="img-thumbnail"
                                loading="lazy"
                              />
                              <span className="badge bg-secondary">{owned_card.quantity}x</span>
                            </div>
                          ))}
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <p>No cards in deck.</p>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      ) : (
        <LoginPrompt />
      )}
      {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseOverlay} />}
    </div>
  );
};

export default Profile;
