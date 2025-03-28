import React from "react";

import { Card as BootstrapCard } from "react-bootstrap";

import Card from "../types/Card";

interface CardDetailsProps {
  card: Card;
}

const CardDetails: React.FC<CardDetailsProps> = ({ card }) => {
  return (
    <BootstrapCard>
      <BootstrapCard.Body>
        <BootstrapCard.Title>{card.name}</BootstrapCard.Title>
        <BootstrapCard.Text>This is a card</BootstrapCard.Text>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default CardDetails;
