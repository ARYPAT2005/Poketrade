import React from "react";
import { Card } from "react-bootstrap";

const SentOffer: React.FC = () => {
  return (
    <div>
      <Card
        style={{
          maxWidth: "min(900px, 90%)",
          margin: "auto",
          marginTop: "50px",
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        <Card.Body>
          <h3 className="text-center mb-3" style={{ fontWeight: "bold" }}>
            Sent Trade Offers
          </h3>

          {/* Hardcoded trade example */}
          <div className="d-flex justify-content-around align-items-center flex-wrap mt-4">
            {/* Your Offer */}
            <div className="text-center" style={{ flex: 1 }}>
              <strong>You Offered:</strong>
              <div className="mt-2">
                <img
                  src="https://images.pokemontcg.io/base1/4.png"
                  alt="Charizard"
                  style={{
                    maxHeight: "300px",
                    width: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "5rem", color: "#444" }}>⇄</span>
            </div>

            {/* Their Card */}
            <div className="text-center" style={{ flex: 1 }}>
              <strong>charizardFan99's Card:</strong>
              <div className="mt-2">
                <img
                  src="https://images.pokemontcg.io/base1/58.png"
                  alt="Pikachu"
                  style={{
                    maxHeight: "300px",
                    width: "auto",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                />
                <div>1x Pikachu</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-4 text-muted">
            Awaiting response from charizardFan99...
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SentOffer;
