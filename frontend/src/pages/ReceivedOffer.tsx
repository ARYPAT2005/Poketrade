import React from "react";
import { Button, Card } from "react-bootstrap";

const ReceivedOffer: React.FC = () => {
  return (
    <div>
      <Card style={{
        maxWidth: "min(900px, 90%)",
        margin: "auto",
        marginTop: "50px",
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
                <img
                  src="https://images.pokemontcg.io/base1/4.png"
                  alt="Charizard"
                  style={{
                    maxHeight: "300px",
                    width: "auto",
                    borderRadius: "10px"
                  }}
                />
                <div>1x Charizard</div>
              </div>
            </div>

            {/* Arrow */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            ><span style={{ fontSize: "5rem", color: "#444" }}>⇄</span>
            </div>
            

            {/* Offerer */}
            <div className="text-center" style={{ flex: 1 }}>
              <strong>charizardFan99 Gives:</strong>
              <div className="mt-2">
                <img
                  src="https://images.pokemontcg.io/base1/58.png"
                  alt="Growlithe"
                  style={{
                    maxHeight: "300px",
                    width: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                  }}
                />
                <div>2x Growlithe</div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="text-center mt-4">
            <Button variant="success" size="sm" className="me-2">
              Accept
            </Button>
            <Button variant="danger" size="sm">
              Reject
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ReceivedOffer;
