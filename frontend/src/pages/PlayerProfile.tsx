import React, { useEffect, useState } from "react";

import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Card, ListGroup } from "react-bootstrap";
import PokemonCard from "../types/Card";
import { useParams } from "react-router-dom";
import Trades, {TradeCardDetail} from "../types/Trades";

type OwnedCard = {
    card_details: PokemonCard;
    quantity: number;
    id: number;
  }
  
  type User = {
    username: string;
    email: string;
    wallet_balance: number;
    last_claim_date: Date | null;
    can_claim: boolean;
    owned_cards: OwnedCard[];
  };
const PlayerProfile: React.FC = () => {
    const userId = useAtomValue(userIdAtom);
    const {playerName} = useParams();
    const [player1, setPlayer1] = useState<User | null>(null);
    const [player2, setPlayer2] = useState<User | null>(null);
    const [tradeStatus, setTradeStatus] = useState<boolean>(false);
    const [player1Cards, setPlayer1Cards] = useState<TradeCardDetail[] | null>(null);
    const [player2Cards, setPlayer2Cards] = useState<TradeCardDetail[] | null>(null);
    const [trade, setTrade] = useState<Trades | null>(null);

    useEffect(() => {
        fetch (`${import.meta.env.VITE_API_URL}/user/${playerName}`)
            .then(response => response.json())
            .then(data => setPlayer2(data))
            .catch((error) => console.error("Error fetching user:", error));
    }, []);
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
              setPlayer1(data);
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              alert("Error fetching user data");
            });
        }
      }, [userId]);

      const handleCardClick = (card_id : number) => {
        return card_id;
      }
    
    return (
        <>
            {!tradeStatus ? 
                <div>
                    <h1>{playerName}'s Profile</h1>
                    <Card
                        style={{
                        maxWidth: "min(1000px, 90%)",
                        margin: "auto",
                        marginTop: "50px",
                        }}
                    >
                        <Card.Body>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Card.Title>Profile Information</Card.Title>
                            {userId !== playerName ? (
                                <button onClick={() => setTradeStatus(true)}>Trade</button>
                            ):
                            ''
                            }
                        </div>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                            <strong>Username:</strong> {player2?.username}
                            </ListGroup.Item>
                            <ListGroup.Item>
                            <strong>Wallet Balance:</strong> ${player2?.wallet_balance}
                            </ListGroup.Item>
                            <ListGroup.Item>
                            Deck:
                            {player2?.owned_cards.map(owned_card => (
                                <div key={owned_card.id}>
                                    <img src={owned_card.card_details.image_url}/>
                                    {owned_card.quantity}
                                </div>
                            ))}
                            </ListGroup.Item>
                        </ListGroup>
                        </Card.Body>
                    </Card>
                    )
            </div>
            :
            <div>
            <h1>Trade with {playerName}</h1>
            <Card style={{
                maxWidth: "min(1000px, 90%)",
                margin: "auto",
                marginTop: "50px",
                padding: "20px"
            }}>
                <div style={{ display: "flex", width: "100%", gap: "20px" }}>

                    <div style={{ flex: 1, backgroundColor: 'lightblue', padding: '10px' }}>
                        <h2>Your Cards</h2>
                        {player1?.owned_cards.map(owned_card => (
                            <div key = {owned_card.id}>
                                <img src={owned_card.card_details.image_url} onClick={() => handleCardClick(owned_card.id)} />
                                <p>x {owned_card.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1,  backgroundColor: 'lightcoral', padding: '10px' }}>
                        <h2>{playerName}'s Cards</h2>
                        {player2?.owned_cards.map(owned_card => (
                            <div key = {owned_card.id}>
                                <img src={owned_card.card_details.image_url} onClick={() => handleCardClick(owned_card.id)} />
                                <p>x {owned_card.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div> 
            </Card>
        </div>
            }
        </>
    );
};
export default PlayerProfile;