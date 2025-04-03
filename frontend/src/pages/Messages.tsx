import React from "react";

import { userIdAtom } from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";

import { Tab, Nav, Card } from "react-bootstrap";

import LoginPrompt from "./LoginPrompt";

const Messages: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  return (
    <div>
      <h1>Messages</h1>
      {userId ? (
        <Card
          style={{
            maxWidth: "min(1000px, 90%)",
            margin: "auto",
            marginTop: "50px",
          }}
        >
          <Card.Body>
            <Tab.Container id="left-tabs-example" defaultActiveKey="tab1">
              <div className="d-flex">
                <Nav variant="pills" className="flex-column me-3">
                  <Nav.Link eventKey="inbox">Inbox</Nav.Link>
                  <Nav.Link eventKey="sent">Sent</Nav.Link>
                  <Nav.Link eventKey="compose">Compose</Nav.Link>
                </Nav>
                <Tab.Content>
                  <Tab.Pane eventKey="tab1">
                    <p>Content for Tab 1</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab2">
                    <p>Content for Tab 2</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab3">
                    <p>Content for Tab 3</p>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </Card.Body>
        </Card>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Messages;
