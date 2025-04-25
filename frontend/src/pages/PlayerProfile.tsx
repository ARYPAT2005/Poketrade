import React, { useEffect, useState } from "react";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Button, Card, ListGroup, Alert, Carousel } from "react-bootstrap";
import PokemonCard from "../types/Card";
import { useParams, useNavigate } from "react-router-dom";
import Trades, { TradeCardDetail } from "../types/Trades";
import CardDetails from "../components/CardDetails";
import "./PlayerProfile.css";

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

const PlayerProfile: React.FC = () => {
    const userId = useAtomValue(userIdAtom);
    const { playerName } = useParams<{ playerName: string }>();
    const [player1, setPlayer1] = useState<User>();
    const [player2, setPlayer2] = useState<User>();
    const [tradeStatus, setTradeStatus] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<{[key: string]: TradeCardDetail[];}>({});
    const [player1Coins, setPlayer1Coins] = useState<number>(0);
    const [player2Coins, setPlayer2Coins] = useState<number>(0);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVariant, setAlertVariant] = useState< 'danger' | 'success' | 'warning' | 'info'>('danger'); 
    const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
    const navigate = useNavigate();

    const handleCardEnlarge = (card: PokemonCard) => {
        setSelectedCard(card);
    };

    const handleCloseOverlay = () => {
        setSelectedCard(null);
    };

    useEffect(() => {
    if (playerName) {
        fetch(`${import.meta.env.VITE_API_URL}/user/${playerName}`)
        .then((response) => response.json())
        .then((data) => setPlayer2(data))
        .catch((error) => console.error("Error fetching player 2:", error));
    }
    }, [playerName]);

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
            console.error("Error fetching player 1 data:", error);
        });
    }
    }, [userId]);

    const handleCardClick = (
        cardToTrade: PokemonCard,
        player: "player1" | "player2",
        uniqueInstanceKey: string
        ) => {
        const newCardDetail: TradeCardDetail = {
            id: 0,
            card_info: cardToTrade,
            quantity: 1,
            direction: player === "player1" ? "offer" : "request",
    };

    setSelectedCards((prev) => {
        const existing = prev[uniqueInstanceKey] || [];
        const index = existing.findIndex(
            (c) =>
            c.card_info.id === cardToTrade.id &&
            c.direction === newCardDetail.direction
        );

        if (index !== -1) {
            const updated = existing.filter((_, i) => i !== index);

            const newState = { ...prev };
            if (updated.length === 0) {
            delete newState[uniqueInstanceKey];
            } else {
            newState[uniqueInstanceKey] = updated;
            }
            return newState;
        } else {
            const owner = player === 'player1' ? player1 : player2;
            const ownedCardEntry = owner?.owned_cards.find(oc => oc.card_details.id === cardToTrade.id);
            const availableQuantity = ownedCardEntry?.quantity ?? 0;
            const alreadySelectedCount = Object.values(prev).flat().filter(
                detail => detail.card_info.id === cardToTrade.id && detail.direction === newCardDetail.direction
            ).length;

            if (alreadySelectedCount < availableQuantity) {
                    return {
                    ...prev,
                    [uniqueInstanceKey]: [...existing, newCardDetail],
                    };
            } else {
                console.warn(`Cannot select more ${cardToTrade.name}. Available: ${availableQuantity}, Selected: ${alreadySelectedCount}`);
                return prev;
            }
        }
        });
    };
    const validateTrade = async () => {
        setAlertMessage(null); 
        if (!player1 || !player2) {
            console.error("Player data missing");
            setAlertMessage("Player data is missing. Please refresh.");
            setAlertVariant('danger');
            return;
        }
        const flattenedSelectedCards = Object.values(selectedCards).flat();
        if (flattenedSelectedCards.length < 1) {
            setAlertMessage("Please select cards or offer/request coins to trade.");
            setAlertVariant('warning'); 
            return;
        }
        if (player1Coins > player1.wallet_balance) {
            setAlertMessage("You cannot send more coins than you have.");
            setAlertVariant('warning');
            return;
        }
        if (player2Coins > player2.wallet_balance) {
            setAlertMessage("You cannot ask for more coins than the other player has.");
            setAlertVariant('warning');
            return;
        }
        const cardMap: { [key: string]: TradeCardDetail } = {};

        flattenedSelectedCards.forEach(detail => {
            const key = `${detail.card_info.id}-${detail.direction}`;
            if (cardMap[key]) {
                cardMap[key].quantity += 1;
            } else {
                cardMap[key] = { ...detail, quantity: 1 };
            }
        });
        const finalCardDetails = Object.values(cardMap);
        const offerCards = finalCardDetails.some(detail => detail.direction === 'offer');
        const requestCards = finalCardDetails.some(detail => detail.direction === 'request');
        if (!offerCards) {
            setAlertMessage("You must offer at least 1 card.");
            setAlertVariant('warning');
            return;
        }
        if (!requestCards) {
            setAlertMessage("You must request at least 1 card.");
            setAlertVariant('warning');
            return;
        }
        const newTrade: Omit<Trades, 'id' | 'timestamp' | 'is_read'> = {
            sender_username: player1.username,
            recipient_username: player2.username,
            status: "pending",
            card_details: finalCardDetails,
            sender_coins: player1Coins,
            recipient_coins: player2Coins,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/trades/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTrade),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Failed to Send Trade - Response Status:", response.status);
                console.error("Failed to Send Trade - Error Data:", errorData);
                console.error("Trade Payload:", JSON.stringify(newTrade));
                setAlertMessage(`Failed to send trade: ${errorData.detail || response.statusText}`);
                setAlertVariant('danger')
            } else {
                const result = await response.json();
                console.log("Trade sent successfully:", result);
                setSelectedCards({});
                setPlayer1Coins(0);
                setPlayer2Coins(0);
                setTradeStatus(false);
                navigate("/trade");
            }
        } catch (error) {
            console.error("Error sending trade:", error);
            setAlertMessage("An error occurred while sending the trade.");
            setAlertVariant('danger')
        }
    };


    const CARDS_PER_PAGE = 5;

    const allPlayer1CardInstances =
        player1?.owned_cards.flatMap((owned_card) =>
            Array.from({ length: owned_card.quantity }).map((_, index) => ({
                uniqueInstanceKey: `${player1.username}-card-${owned_card.card_details.id}-inst-${index}`,
                ownedCardId: owned_card.id,
                cardDetails: owned_card.card_details,
            }))
        ) || [];

    const allPlayer2CardInstances =
        player2?.owned_cards.flatMap((owned_card) =>
            Array.from({ length: owned_card.quantity }).map((_, index) => ({
            uniqueInstanceKey: `${player2.username}-card-${owned_card.card_details.id}-inst-${index}`,
            ownedCardId: owned_card.id,
            cardDetails: owned_card.card_details,
            }))
        ) || [];

    const chunkedPlayer1Cards = chunkArray(allPlayer1CardInstances, CARDS_PER_PAGE);
    const chunkedPlayer2Cards = chunkArray(allPlayer2CardInstances, CARDS_PER_PAGE);
    const PROFILE_CARDS_PER_PAGE = 8;
    const chunkedProfileCards = player2?.owned_cards
        ? chunkArray(player2.owned_cards, PROFILE_CARDS_PER_PAGE)
        : []; 

    return (
        <>
            {!tradeStatus ? (
            //Profile View
            <div>
                <h1>{playerName}'s Profile</h1>
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
                        <Card.Title>Profile Information</Card.Title>
                        {userId && userId !== playerName && (
                            <Button variant="warning" onClick={() => setTradeStatus(true)}>
                                Initiate Trade
                            </Button>
                        )}
                    </div>
                    <ListGroup variant="flush">
                    <ListGroup.Item>
                        <strong>Username:</strong> {player2?.username ?? 'Loading...'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Wallet Balance:</strong> ${player2?.wallet_balance ?? '...'}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <strong>Deck:</strong>
                        {chunkedProfileCards.length > 0 ? (
                            <Carousel
                                interval={null}
                                indicators={chunkedProfileCards.length > 1}
                                controls={chunkedProfileCards.length > 1}
                            >
                                {chunkedProfileCards.map((cardChunk, index) => (
                                    <Carousel.Item key={`profile-page-${index}`}>
                                        <div
                                            className="d-flex flex-wrap justify-content-center justify-content-sm-start gap-3 p-2"
                                            style={{ minHeight: '150px' }}
                                        >
                                            {cardChunk.map((owned_card) => (
                                                <div
                                                    key={`${player2?.username}-profile-${owned_card.id}`}
                                                    className="d-flex flex-column align-items-center profile-deck-card"
                                                >
                                                    <img
                                                        src={owned_card.card_details.image_url}
                                                        alt={owned_card.card_details.name}
                                                        style={{
                                                            height: 'auto',
                                                            marginBottom: '5px',
                                                            cursor: 'pointer',
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
            </div>
            ) : (
            //Trade View
            <div>
                <h1>Trade with {playerName}</h1>
                <Card
                style={{
                    maxWidth: "min(1200px, 95%)",
                    margin: "auto",
                    marginTop: "30px",
                    padding: "20px",
                }}
                >
                <div className="container-fluid">
                    <div className="row gy-4">

                    {/* Player 1 Cards (Offer) */}
                    <div className="col-lg-6">
                        <div className="trade-section p-3 border rounded" style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)' }}>
                        <h2 className="text-center mb-3">Your Cards (Offering)</h2>
                        {/* Player 1 Coin Input */}
                        <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
                            <label htmlFor="player1Coins" className="form-label mb-0">Offer Coins:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player1Coins"
                                value={player1Coins}
                                onChange={(e) => setPlayer1Coins(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                                max={player1?.wallet_balance ?? 0}
                                style={{ maxWidth: '100px' }}
                            />
                            <small>(Max: ${player1?.wallet_balance ?? 0})</small>
                        </div>
                        {chunkedPlayer1Cards.length > 0 ? (
                            <Carousel
                            interval={null}
                            indicators={chunkedPlayer1Cards.length > 1}
                            controls={chunkedPlayer1Cards.length > 1}
                            className="card-carousel"
                            >
                            {chunkedPlayer1Cards.map((cardChunk, pageIndex) => (
                                <Carousel.Item key={`player1-page-${pageIndex}`}>
                                <div className="d-flex flex-wrap justify-content-center gap-3 p-2" style={{minHeight: '250px'}}>
                                    {cardChunk.map((cardInstance) => (
                                    <div
                                        className="col-5 col-sm-4 col-md-3 col-lg-3 mb-3 d-flex justify-content-center"
                                        key={cardInstance.uniqueInstanceKey}
                                    >
                                        <img
                                        src={cardInstance.cardDetails.image_url}
                                        className={`img-fluid card-img-top rounded mx-auto d-block ${
                                            selectedCards[cardInstance.uniqueInstanceKey] ? "card-selected" : ""
                                        }`}
                                        onClick={() =>
                                            handleCardClick(
                                            cardInstance.cardDetails,
                                            "player1",
                                            cardInstance.uniqueInstanceKey
                                            )
                                        }
                                        style={{ cursor: "pointer", maxWidth: '120px' }}
                                        alt={cardInstance.cardDetails.name}
                                        />
                                    </div>
                                    ))}
                                </div>
                                </Carousel.Item>
                            ))}
                            </Carousel>
                        ) : (
                            <Alert variant="info" className="text-center">You have no cards to offer.</Alert>
                        )}
                        </div>
                    </div>

                    {/* Player 2 Cards (Request) */}
                    <div className="col-lg-6">
                        <div className="trade-section p-3 border rounded" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
                        <h2 className="text-center mb-3">{player2?.username}'s Cards (Requesting)</h2>
                        {/* Player 2 Coin Input */}
                        <div className="mb-3 d-flex justify-content-center align-items-center gap-2">
                            <label htmlFor="player2Coins" className="form-label mb-0">Request Coins:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="player2Coins"
                                value={player2Coins}
                                onChange={(e) => setPlayer2Coins(Math.max(0, parseInt(e.target.value) || 0))}
                                min="0"
                                max={player2?.wallet_balance ?? 0}
                                style={{ maxWidth: '100px' }}
                            />
                                <small>(Max: ${player2?.wallet_balance ?? 0})</small>
                        </div>
                        {chunkedPlayer2Cards.length > 0 ? (
                            <Carousel
                            interval={null}
                            indicators={chunkedPlayer2Cards.length > 1}
                            controls={chunkedPlayer2Cards.length > 1}
                            className="card-carousel"
                            >
                            {chunkedPlayer2Cards.map((cardChunk, pageIndex) => (
                                <Carousel.Item key={`player2-page-${pageIndex}`}>
                                <div className="d-flex flex-wrap justify-content-center gap-3 p-2" style={{minHeight: '250px'}}>
                                    {cardChunk.map((cardInstance) => (
                                    <div
                                        className="col-5 col-sm-4 col-md-3 col-lg-3 mb-3 d-flex justify-content-center"
                                        key={cardInstance.uniqueInstanceKey}
                                    >
                                        <img
                                        src={cardInstance.cardDetails.image_url}
                                        className={`img-fluid card-img-top rounded mx-auto d-block ${
                                            selectedCards[cardInstance.uniqueInstanceKey] ? "card-selected" : ""
                                        }`}
                                        onClick={() =>
                                            handleCardClick(
                                            cardInstance.cardDetails,
                                            "player2",
                                            cardInstance.uniqueInstanceKey
                                            )
                                        }
                                        style={{ cursor: "pointer", maxWidth: '120px' }}
                                        alt={cardInstance.cardDetails.name}
                                        />
                                    </div>
                                    ))}
                                </div>
                                </Carousel.Item>
                            ))}
                            </Carousel>
                        ) : (
                            <Alert variant="info" className="text-center">{playerName} has no cards available for trade.</Alert>
                        )}
                        </div>
                    </div>
                    </div>
                </div>

                {alertMessage && (
                    <Alert
                        variant={alertVariant}
                        onClose={() => setAlertMessage(null)}
                        dismissible
                        className="mt-3 mb-3"
                    >
                        {alertMessage}
                    </Alert>
                )}
                    <div className="d-flex justify-content-center gap-3 mt-3">
                        <Button variant="secondary" onClick={() => {
                            setTradeStatus(false);
                            setSelectedCards({});
                            setPlayer1Coins(0);
                            setPlayer2Coins(0);
                        }}>
                            Cancel Trade
                        </Button>
                        <Button variant="success" onClick={validateTrade}>
                            Send Trade Offer
                        </Button>
                    </div>
                </Card>
            </div>
            )}
            {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseOverlay} />}
        </>
    );
};
export default PlayerProfile;