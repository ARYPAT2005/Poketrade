import React, { useState, useEffect } from "react";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import {
  Card,
  Tabs,
  Tab,
  Button,
  Row,
  Col,
  Container,
  Badge,
  Carousel,
  Pagination,
  InputGroup,
  ListGroup,
  Form,
} from "react-bootstrap";
import LoginPrompt from "./LoginPrompt";
import Trades, { TradeCardDetail } from "../types/Trades";
import CardDetails from "../components/CardDetails";
import PokemonCard from "../types/Card";
import "./Trade.css";
import ApiService from "../services/ApiService";

type User = {
  id: number;
  username: string;
  email: string;
};

const Trade: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [trades, setTrades] = useState<Trades[]>([]);
  const [receivedTrades, setReceivedTrades] = useState<Trades[]>([]);
  const [sentTrades, setSentTrades] = useState<Trades[]>([]);
  const [completedTrades, setCompletedTrades] = useState<Trades[]>([]);
  const [activeTab, setActiveTab] = useState<string>("received");
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchString, setSearchString] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const apiService = ApiService.getInstance();

  const handleCardClick = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseOverlay = () => {
    setSelectedCard(null);
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

  useEffect(() => {
    if (!userId) {
      setTrades([]);
      return;
    }
    const fetchData = async () => {
      const fetchTrades = await apiService.fetchUserTrades(userId);
      setTrades(fetchTrades);
    }
    fetchData();
    
  }, [userId]);

  useEffect(() => {
    sortTrades();
  }, [trades]);

  const sortTrades = () => {
    console.log("Sorting Trades.");
    const received: Trades[] = trades.filter(
      (trade) => trade.recipient_username === userId && trade.status === "pending"
    );
    setReceivedTrades(received);

    const sent: Trades[] = trades.filter((trade) => trade.sender_username === userId && trade.status === "pending");
    setSentTrades(sent);

    const completed: Trades[] = trades.filter((trade) => trade.status === "accepted");
    setCompletedTrades(completed);
  };

  const handleTradeResponse = async (tradeId: number, status: string) => {
    try {
      const response = await apiService.updateTradeStatus(tradeId, status);

      const updatedTrade: Trades = response;

      setTrades((prevTrades) => prevTrades.map((trade) => (trade.id === tradeId ? updatedTrade : trade)));
      sortTrades();
    } catch (err: any) {
      console.error("Error responding to trade:", err);
    }
  };

  const renderTradeDetails = (trade: Trades) => {
    const offers: TradeCardDetail[][] = chunkArray(
      trade.card_details.filter((detail) => detail.direction === "offer"),
      6
    );
    const requests: TradeCardDetail[][] = chunkArray(
      trade.card_details.filter((detail) => detail.direction === "request"),
      6
    );
    const isSender: boolean = trade.sender_username === userId;

    const renderCarousel = (items: TradeCardDetail[][]) =>
      items.length > 0 ? (
        <Carousel interval={null} indicators={items.length > 1} controls={items.length > 1} className="trade-carousel">
          {items.map((group: TradeCardDetail[], index) => (
            <Carousel.Item key={index}>
              <div className="d-flex justify-content-center flex-wrap gap-2 p-2 carousel-inner-wrapper">
                {group.map((detail) => (
                  <div key={detail.id} className="trade-pokemon-card">
                    {detail.card_info.image_url && (
                      <img
                        src={detail.card_info.image_url}
                        alt={detail.card_info.name}
                        className="trade-card-image"
                        onClick={() => handleCardClick(detail.card_info)}
                      />
                    )}
                    <div className="trade-card-name-container">
                      <div className="card-name-text">{detail.card_info.name}</div>
                      <div className="card-badge-line">
                        <Badge pill bg="dark" className="me-1">
                          {detail.quantity}x
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="text-muted text-center p-4 d-flex align-items-center justify-content-center h-100">
          <small>Nothing</small>
        </div>
      );
    return (
      <Container fluid key={trade.id} className="trade-details-wrapper mb-4">
        <Row className="mb-2 trade-header">
          <Col className="text-center">
            {isSender ? (
              <h5>
                Trade Offer to{" "}
                <strong>
                  <a href={`/player/${trade.recipient_username}`}>{trade.recipient_username}</a>
                </strong>
              </h5>
            ) : (
              <h5>
                Trade Offer from{" "}
                <strong>
                  <a href={`/player/${trade.sender_username}`}>{trade.sender_username}</a>
                </strong>
              </h5>
            )}
          </Col>
        </Row>
        <Row className="align-items-stretch">
          <Col md={5} className="trade-section">
            <div className="trade-section-header text-center mb-2">
              {isSender && !completedTrades.includes(trade) && <strong>You Offer:</strong>}
              {!isSender && !completedTrades.includes(trade) && <strong>{trade.sender_username} Offers:</strong>}
              {!isSender && completedTrades.includes(trade) && <strong>{trade.sender_username} Gave:</strong>}
              {isSender && completedTrades.includes(trade) && <strong>You Gave:</strong>}
            </div>
            {renderCarousel(offers)}
          </Col>

          <Col
            md={2}
            className="d-flex flex-column align-items-center justify-content-center trade-arrow-column text-center px-0"
          >
            {trade.sender_coins >= 0 && (
              <div className="trade-coins-display mb-2">
                <small className="text-muted d-block coin-label">
                  {isSender ? "You Offer" : `${trade.sender_username} Offers`}
                </small>
                <div>
                  <strong>${trade.sender_coins}</strong>
                </div>
              </div>
            )}

            {trade.sender_coins > 0 && !(trade.sender_coins > 0) && <div className="coin-spacer"></div>}
            <span className="trade-arrow-icon my-1">⇄</span>
            {!(trade.sender_coins > 0) && trade.recipient_coins > 0 && <div className="coin-spacer"></div>}

            {trade.recipient_coins >= 0 && (
              <div className="trade-coins-display mt-2">
                <small className="text-muted d-block coin-label">
                  {isSender ? "You Request" : `${trade.sender_username} Requests`}
                </small>
                <div>
                  <strong>${trade.recipient_coins}</strong>
                </div>
              </div>
            )}
            {trade.sender_coins <= 0 && trade.recipient_coins <= 0 && <div className="my-2 coin-placeholder"></div>}
          </Col>

          <Col md={5} className="trade-section">
            <div className="trade-section-header text-center mb-2">
              {!isSender && !completedTrades.includes(trade) && <strong>You Give: </strong>}
              {isSender && !completedTrades.includes(trade) && <strong>You Request: </strong>}
              {!isSender && completedTrades.includes(trade) && <strong>You Gave: </strong>}
              {isSender && completedTrades.includes(trade) && <strong>{trade.recipient_username} Gave: </strong>}
            </div>
            {renderCarousel(requests)}
          </Col>
        </Row>

        {trade.status === "pending" && (
          <Row className="mt-3">
            <Col className="text-center">
              {!isSender ? (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2 shadow-sm"
                    onClick={() => handleTradeResponse(trade.id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="shadow-sm"
                    onClick={() => handleTradeResponse(trade.id, "rejected")}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="shadow-sm"
                  onClick={() => handleTradeResponse(trade.id, "cancelled")}
                >
                  Cancel Trade
                </Button>
              )}
            </Col>
          </Row>
        )}
      </Container>
    );
  };

  const renderPaginatedTrades = (
    trades: Trades[], // The full list of trades for this tab
    currentPage: number, // The current page state for this tab
    setCurrentPage: (page: number) => void // The state setter function
  ) => {
    const totalPages = Math.ceil(trades.length / 4);
    const startIndex = (currentPage - 1) * 4;
    const endIndex = startIndex + 4;
    const currentTrades = trades.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); // Optional: Scroll to top on page change
    };

    return (
      <>
        {currentTrades.length > 0 ? (
          currentTrades.map((trade) => renderTradeDetails(trade))
        ) : (
          <p className="text-center text-muted p-3">No trades found.</p>
        )}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </>
    );
  };

  useEffect(() => {
    if (searchString) {
      console.log("Searching for users:", searchString);
      try {
        fetch(`${import.meta.env.VITE_API_URL}/users/list/${searchString}/`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Network response was not ok (${response.status})`);
            }
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.error || data.errors) {
              // No users
              setUsers([]);
              return;
            }
            if (Array.isArray(data)) {
              console.log("Setting users.");
              setUsers(data);
            } else {
              console.log("Data isn't an array.");
              setUsers([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching users:", error);
          });
      } catch (err) {
        console.error("Error getting users:", err);
      }
    } else {
      setUsers([]);
    }
  }, [searchString]);

  return (
    <div>
      <h1>Trade Center</h1>
      {!userId ? (
        <LoginPrompt />
      ) : (
        <Card style={{ maxWidth: "min(1000px, 90%)", margin: "auto", marginTop: "50px" }}>
          <Card.Body>
            <div
              style={{
                maxWidth: "min(1000px, 90%)",
                margin: "auto",
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <InputGroup>
                <Form.Control
                  placeholder="Search by player name"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchString("")}
                  style={{
                    width: "80px",
                  }}
                >
                  Clear
                </Button>
              </InputGroup>
              <ListGroup style={{ maxHeight: "200px" }}>
                {users.map((user) => (
                  <a href={`/player/${user.username}`}>
                    <ListGroup.Item
                      key={user.id}
                      href="/player/${user.username}"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <strong>{user.username}</strong>
                    </ListGroup.Item>
                  </a>
                ))}
              </ListGroup>
            </div>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k || "received")}
              id="trade-tabs"
              className="mb-3"
              fill
            >
              <Tab
                eventKey="received"
                title={
                  <span>
                    Received Offers{" "}
                    <Badge pill bg="secondary">
                      {receivedTrades.length}
                    </Badge>
                  </span>
                }
              >
                {activeTab === "received" && receivedTrades.length > 0 ? (
                  <Container>{renderPaginatedTrades(receivedTrades, currentPage, setCurrentPage)}</Container>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
              <Tab
                eventKey="sent"
                title={
                  <span>
                    Sent Offers{" "}
                    <Badge pill bg="secondary">
                      {sentTrades.length}
                    </Badge>
                  </span>
                }
              >
                {activeTab === "sent" && sentTrades.length > 0 ? (
                  <Container>{renderPaginatedTrades(sentTrades, currentPage, setCurrentPage)}</Container>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
              <Tab
                eventKey="completed"
                title={
                  <span>
                    Completed Trades
                    <Badge pill bg="secondary">
                      {completedTrades.length}
                    </Badge>
                  </span>
                }
              >
                {activeTab === "completed" && completedTrades.length > 0 ? (
                  <Container>{renderPaginatedTrades(completedTrades, currentPage, setCurrentPage)}</Container>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
      {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseOverlay} />}
    </div>
  );
};

export default Trade;
