import React, { useState, useEffect, useMemo } from "react";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Card, Tabs, Tab, ListGroup, Button, Spinner, Alert } from "react-bootstrap";
import LoginPrompt from "./LoginPrompt";
import Trades, { TradeCardDetail } from "../types/Trades"; 

const Trade: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [trades, setTrades] = useState<Trades[]>([]);
  const [receivedTrades, setReceivedTrades] = useState<Trades[]>([]);
  const [sentTrades, setSentTrades] = useState<Trades[]>([]);
  const [completedTrades, setCompletedTrades] = useState<Trades[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('received');
  useEffect(() => {
    if (!userId) {
      setTrades([]);
      return;
    }
    setError(null);

    fetch(`http://localhost:8000/api/trades/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          console.log("Setting trades.");
          setTrades(data);
        } else {
          console.log("Data isn't an array.");
        }
      })
      .catch((error) => {
        console.error("Error fetching received trades:", error);
        setError(error.message || "Failed to fetch received trades.");
      })

  }, [userId]);

  useEffect(() => {
    sortTrades();
  }, [trades])

  const sortTrades = () => {
    console.log("Sorting Trades.")
    const received: Trades[] = trades.filter(trade => trade.recipient_username === userId && trade.status === "pending");
    setReceivedTrades(received);

    const sent: Trades[] = trades.filter(trade => trade.sender_username === userId && trade.status === 'pending');
    setSentTrades(sent);

    const completed: Trades[] = trades.filter(trade => trade.status === "accepted");
    setCompletedTrades(completed);
  }

  const handleTradeResponse = async (tradeId: number, status: string) => {
      setError(null);

      try {
          const response = await fetch(`http://localhost:8000/api/trades/id/${tradeId}/`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ status: status }),
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.detail || `Failed to update trade (${response.status})`);
          }

          const updatedTrade: Trades = await response.json();

          setTrades(prevTrades =>
            prevTrades.map(trade => 
              trade.id === tradeId ? updatedTrade : trade
            )
          )
          sortTrades();

      } catch (err: any) {
          console.error("Error responding to trade:", err);
          setError(err.message || "Failed to update trade status.");
      }
  };

  const renderTradeDetails = (trade: Trades) => {
    const offers: TradeCardDetail[] = trade.card_details.filter(detail => detail.direction === 'offer');
    const requests: TradeCardDetail[] = trade.card_details.filter(detail => detail.direction === 'request');
    const isSender: boolean = trade.sender_username === userId;
    return (
      <ListGroup.Item key={trade.id} className="mb-3 border rounded p-3">
        {isSender ? 
          <h5>Trade Offer to: {trade.recipient_username}</h5>
        : <h5>Trade Offer from: {trade.sender_username}</h5>
        }
        {trade.message && <p className="mb-1">Message: <em>{trade.message}</em></p>}
        <div className="d-flex justify-content-around flex-wrap">
          <div className="m-2">
            {isSender ?
              <strong>You offer</strong>
              :<strong>{trade.sender_username} offers:</strong>
            }
            
            {offers.length > 0 ? (
                <ListGroup variant="flush" className="mt-1">
                    {offers.map((detail: TradeCardDetail) => (
                        <ListGroup.Item key={detail.id} className="d-flex align-items-center p-1">
                            {detail.quantity}x {detail.card_info.name}
                            {detail.card_info.image_url && <img src={detail.card_info.image_url} alt={detail.card_info.name} style={{maxWidth: '40px', height: 'auto', marginLeft: '10px', borderRadius: '4px'}} />}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : ( <p className="text-muted mt-1">Nothing</p> )}
          </div>
          <div className="m-2">
              <strong>Requesting:</strong>
                {requests.length > 0 ? (
                  <ListGroup variant="flush" className="mt-1">
                      {requests.map((detail: TradeCardDetail) => (
                          <ListGroup.Item key={detail.id} className="d-flex align-items-center p-1">
                              {detail.quantity}x {detail.card_info.name}
                              {detail.card_info.image_url && <img src={detail.card_info.image_url} alt={detail.card_info.name} style={{maxWidth: '40px', height: 'auto', marginLeft: '10px', borderRadius: '4px'}} />}
                          </ListGroup.Item>
                      ))}
                  </ListGroup>
                ) : ( <p className="text-muted mt-1">Nothing</p> )}
            </div>
        </div>
          {trade.status === 'pending' && !isSender &&
            <div className="mt-3 text-center">
              <Button variant="success" size="sm" className="me-2" onClick={() => handleTradeResponse(trade.id, "accepted")}>Accept</Button>
              <Button variant="danger" size="sm" onClick={() => handleTradeResponse(trade.id, "rejected")}>Reject</Button>
            </div>
          }
          {trade.status === 'pending' && isSender &&
            <div className="mt-3 text-center">
              <Button variant="secondary" size="sm" className="me-2" onClick={() => handleTradeResponse(trade.id, "cancelled")}>Cancel</Button>
            </div>
          }
      </ListGroup.Item>
    );
  }

  const receivedTradeElements = useMemo(() => {
    return receivedTrades.map(trade => renderTradeDetails(trade))
  }, [receivedTrades])

  const sentTradeElements = useMemo(() => {
    return sentTrades.map(trade => renderTradeDetails(trade))
  }, [sentTrades])

  const completedTradeElements = useMemo(() => {
    return completedTrades.map(trade => renderTradeDetails(trade))
  }, [completedTrades])

  return (
    <div>
      <h1>Trade Center</h1>
      {!userId ? (
        <LoginPrompt />
      ) : (
        <Card style={{maxWidth: "min(1000px, 90%)", margin: "auto", marginTop: "50px",}}>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'received')} id="trade-tabs" className="mb-3" fill>
              <Tab eventKey="received" title="Received Offers">
                {activeTab === 'received' && receivedTrades.length > 0 ? (
                  <ListGroup variant="flush">
                    {receivedTradeElements}
                  </ListGroup>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
              <Tab eventKey="sent" title="Sent Offers">
                {activeTab === 'sent' && sentTrades.length > 0 ? (
                  <ListGroup variant="flush">
                    {sentTradeElements}
                  </ListGroup>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
              <Tab eventKey="completed" title="Completed Trades">
                {activeTab === 'completed' && completedTrades.length > 0 ? (
                  <ListGroup variant="flush">
                    {completedTradeElements}
                  </ListGroup>
                ) : (
                  <p className="text-center p-3">You have no incoming trade offers.</p>
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Trade;