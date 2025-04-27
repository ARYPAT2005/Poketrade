import React from "react";
import { Card } from "react-bootstrap";

const CompletedOffer: React.FC = () => {
  return (
    <div>
      <Card
        style={{
          maxWidth: "min(600px, 90%)",
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
            Completed Trade
          </h3>

          <div className="text-center">
            <p className="mb-2"><strong>You received:</strong></p>
            <img
              src="https://images.pokemontcg.io/base1/58.png" // Pikachu
              alt="Pikachu"
              style={{
                maxHeight: "300px",
                width: "auto",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              }}
            />
            <div className="mt-2"><strong>1x Pikachu</strong></div>
          </div>

          <div className="text-center mt-3 text-muted">
            Trade with <strong>charizardFan99</strong> completed successfully.
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CompletedOffer;
