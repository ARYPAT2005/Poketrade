import React from "react";

import userIdAtom from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";
import { Card, Tabs, Tab, ListGroup } from "react-bootstrap";
import LoginPrompt from "./LoginPrompt";

const Trade: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  return (
    <div>
      <h1>Trade</h1>
      {userId ? (
        <Card
          style={{
            maxWidth: "min(1000px, 90%)",
            margin: "auto",
            marginTop: "50px",
          }}
        >
          <Card.Body>
            <Tabs
              defaultActiveKey="sent"
              id="fill-tab-example"
              className="mb-3"
              style={{ width: "100%", margin: "auto" }}
            >
              <Tab eventKey="sent" title="Sent" className="text-center">
                <ListGroup>
                  <ListGroup.Item>Trade 1</ListGroup.Item>
                  <ListGroup.Item>Trade 2</ListGroup.Item>
                  <ListGroup.Item>Trade 3</ListGroup.Item>
                </ListGroup>
              </Tab>
              <Tab eventKey="received" title="Received" className="text-center">
                <ListGroup>
                  <ListGroup.Item>Trade 1</ListGroup.Item>
                  <ListGroup.Item>Trade 2</ListGroup.Item>
                  <ListGroup.Item>Trade 3</ListGroup.Item>
                </ListGroup>
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Trade;
