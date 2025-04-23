import React, { useEffect, useState } from "react";

import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Button, Card, ListGroup, Alert, Carousel } from "react-bootstrap";
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
    const [player1, setPlayer1] = useState<User>();
    const [player2, setPlayer2] = useState<User>();
    const [tradeStatus, setTradeStatus] = useState<boolean>(false);
    const [player1Cards, setPlayer1Cards] = useState<TradeCardDetail[]>();
    const [player2Cards, setPlayer2Cards] = useState<TradeCardDetail[]>();
    const [trade, setTrade] = useState<Trades>();

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

    const handleCardClick = (cardToTrade : PokemonCard, player: string) => {
        let cardDetail: TradeCardDetail;
        const card = cardToTrade
        if (player === "player1") {
            cardDetail = {
                id: 100,
                card_info: card,
                quantity: 1,
                direction: "offer"
            }
            let cardFound = false;
            for (const cards of player1Cards ?? []) {
                if (cards.card_info === card) {
                    cards.quantity++;
                    cardFound = true;
                }
            }
            if (!cardFound)
                setPlayer1Cards([...(player1Cards ?? []), cardDetail]);
        } else {
            cardDetail = {
                id: 100,
                card_info: card,
                quantity: 1,
                direction: "request"
            }
            let cardFound = false;
            for (const cards of player2Cards ?? []) {
                if (cards.card_info === card) {
                    cards.quantity++;
                    cardFound = true;
                }
            }
            if (!cardFound)
                setPlayer2Cards([...(player2Cards ?? []), cardDetail]);
        }
    }

    useEffect(() => {
        const sendTrade = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trades/`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(trade),
                });
                if (!response.ok) {
                    console.log("Failed to Send Trade");
                    console.log("Trade:", JSON.stringify(trade));
                    if (player2)
                    console.log(player2.username);
                } else {
                    setPlayer1Cards([]);
                    setPlayer2Cards([]);
                    setTrade(undefined);
                    setTradeStatus(false);
                }
            } catch (error) {
                console.error('Error sending trade:', error);
            }
        };
        sendTrade();    
    }, [trade])

    const validateTrade = () => {
        if (!player1 || !player2) return;
        setTrade({
            id: 100,
            sender_username: player1.username,
            recipient_username: player2.username,
            message: "hello",
            timestamp: "yes",
            is_read: false,
            status: 'pending',
            card_details: [...player1Cards?? [] , ...player2Cards?? []],
            sender_coins: 0,
            recipient_coins: 0,
        });
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
                            {userId !== playerName && userId ? (
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
                                <div key={owned_card.id + player2.username}>
                                    <img key={owned_card.id + player2.username} className="pokemon-card" src={owned_card.card_details.image_url}/>
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
                            <div key = {owned_card.id + player1.username}>
                                {Array.from({ length: owned_card.quantity }).map((_, index) => (
                                    <img key={owned_card.id + player1.username + index} className="pokemon-card" src={owned_card.card_details.image_url} onClick={() => handleCardClick(owned_card.card_details, "player1")} style={{ cursor: 'pointer' }} />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: 1,  backgroundColor: 'lightcoral', padding: '10px' }}>
                        <h2>{playerName}'s Cards</h2>
                        {player2?.owned_cards.map(owned_card => (
                            <div key = {owned_card.id + player2.username}>
                                {Array.from({ length: owned_card.quantity }).map((_, index) => (
                                    <img key={owned_card.id + player2.username + index} className="pokemon-card" src={owned_card.card_details.image_url} onClick={() => handleCardClick(owned_card.card_details, "player2")} style={{ cursor: 'pointer' }} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <Button onClick={() => { validateTrade() }}>Send Trade</Button>
            </Card>
        </div>
            }
        </>
    );
};
export default PlayerProfile;