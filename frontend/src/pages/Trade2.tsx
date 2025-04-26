import React, { useState, useEffect } from "react";
import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Card, Tabs, Tab, Button } from "react-bootstrap";
import LoginPrompt from "./LoginPrompt";
import Trades from "../types/Trades";

const Trade2: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [trades, setTrades] = useState<Trades[]>([]);
  const [receivedTrades, setReceivedTrades] = useState<Trades[]>([]);
  const [, setSentTrades] = useState<Trades[]>([]);
  const [, setCompletedTrades] = useState<Trades[]>([]);
  const [activeTab, setActiveTab] = useState<string>('received');

  useEffect(() => {
    if (!userId) {
      setTrades([]);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/trades/${userId}`)
      .then(res => res.json())
      .then(data => setTrades(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    const received = trades.filter(trade => trade.recipient_username === userId && trade.status === "pending");
    const sent = trades.filter(trade => trade.sender_username === userId && trade.status === "pending");
    const completed = trades.filter(t => t.status === "accepted");
    setReceivedTrades(received);
    setSentTrades(sent);
    setCompletedTrades(completed);
  }, [trades, userId]);

  console.log("receivedTrades", receivedTrades);
  console.log("userId", userId);

  return (
    <div>
      <h1 className="text-center">Trade Center</h1>
      {!userId && <LoginPrompt />}
      {userId && (
        <Card style={{ maxWidth: "min(1000px, 90%)", margin: "3rem auto" }}>
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={k => setActiveTab(k || "received")} fill>

              {/* Received offers */}
              <Tab eventKey="received" title="Received Offers">
                <Card style={{
                  maxWidth: "min(900px, 90%)",
                  margin: "auto",
                  marginTop: "20px",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                  padding: "20px"
                }}>
                  <Card.Body>
                    <h5 className="text-center mb-3">Trade Offer from: charizardFan99</h5>
                    <p className="text-muted text-center mb-3"><em>Hey! Want to swap these?</em></p>

                    <div className="d-flex justify-content-around align-items-center flex-wrap">
                      {/* Receiver (You) */}
                      <div className="text-center" style={{ flex: 1 }}>
                        <strong>You Offer:</strong>
                        <div className="mt-2">
                          <img src="https://images.pokemontcg.io/base1/4.png" alt="Charizard" style={{ maxHeight: "300px", width: "auto", borderRadius: "10px" }} />
                          <div>1x Charizard</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <span style={{ fontSize: "5rem", color: "#444" }}>⇄</span>
                      </div>
                      <div className="text-center" style={{ flex: 1 }}>
                        <strong>charizardFan99 Gives:</strong>
                        <div className="mt-2">
                          <img src="https://images.pokemontcg.io/base1/58.png" alt="Growlithe" style={{ maxHeight: "300px", width: "auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
                          <div>2x Growlithe</div>
                        </div>
                      </div>
                    </div>

                    {/* Coins Section */}
                    <div className="text-center mt-3">
                      <strong>charizardFan99 Also Offers:</strong>
                      <div className="mt-1" style={{
                        display: "inline-block",
                        backgroundColor: "#f8f9fa",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                      }}>
                        100 PokeCoins
                      </div>
                    </div>

                    <div className="text-center mt-2 text-danger">
                      <strong>You Must Also Send:</strong> 50 PokeCoins
                    </div>

                    <div className="text-center mt-4">
                      <Button variant="success" size="sm" className="me-2">Accept</Button>
                      <Button variant="danger" size="sm">Reject</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              {/* Sent offers */}
              <Tab eventKey="sent" title="Sent Offers">
                <Card style={{ maxWidth: "min(900px, 90%)", margin: "auto", marginTop: "20px", borderRadius: "20px", backgroundColor: "rgba(255, 255, 255, 0.6)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                  <Card.Body>
                    <h3 className="text-center" style={{ fontWeight: "bold" }}>Sent Trade Offers</h3>
                    <div className="d-flex justify-content-around align-items-center flex-wrap mt-4">
                      <div className="text-center" style={{ flex: 1 }}>
                        <strong>You Offered:</strong>
                        <div className="mt-2">
                          <img src="https://images.pokemontcg.io/base1/4.png" alt="Charizard" style={{ maxHeight: "300px", width: "auto", borderRadius: "10px" }} />
                          <div>1x Charizard</div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <span style={{ fontSize: "5rem", color: "#444" }}>⇄</span>
                      </div>
                      <div className="text-center" style={{ flex: 1 }}>
                        <strong>charizardFan99's Card:</strong>
                        <div className="mt-2">
                          <img src="https://images.pokemontcg.io/base1/58.png" alt="Pikachu" style={{ maxHeight: "300px", width: "auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
                          <div>1x Pikachu</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <strong>You Also Offered:</strong>
                      <div className="mt-1" style={{
                        display: "inline-block",
                        backgroundColor: "#e6ffe6",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                      }}>
                        50 PokeCoins
                      </div>
                    </div>
                    <div className="text-center mt-4 text-muted">
                      Awaiting response from charizardFan99...
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

              {/* Completed offers */}
              <Tab eventKey="completed" title="Completed Trades">
                <Card style={{ maxWidth: "min(600px, 90%)", margin: "auto", marginTop: "20px", borderRadius: "20px", backgroundColor: "rgba(255, 255, 255, 0.6)", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", padding: "20px" }}>
                  <Card.Body>
                    <h3 className="text-center mb-3" style={{ fontWeight: "bold" }}>Completed Trade</h3>
                    <div className="text-center">
                      <p className="mb-2"><strong>You received:</strong></p>
                      <img src="https://images.pokemontcg.io/base1/58.png" alt="Pikachu" style={{ maxHeight: "300px", width: "auto", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
                      <div className="mt-2"><strong>1x Pikachu</strong></div>
                      <div className="mt-3 text-success"><strong>100 PokeCoins received</strong></div>
                    </div>
                    <div className="text-center mt-3 text-muted">
                      Trade with <strong>charizardFan99</strong> completed successfully.
                    </div>
                  </Card.Body>
                </Card>
              </Tab>

            </Tabs>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Trade2;
