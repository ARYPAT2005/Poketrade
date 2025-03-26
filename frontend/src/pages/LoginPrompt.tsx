import React from "react";
import { InfoCircle } from "react-bootstrap-icons";
import { Card } from "react-bootstrap";

const LoginPrompt: React.FC = () => {
  return (
    <Card
      style={{
        maxWidth: "min(500px, 90%)",
        margin: "auto",
        marginTop: "50px",
      }}
    >
      <Card.Header>
        <InfoCircle style={{ marginRight: "0.5em", marginBottom: "0.2em" }} />
        Login Required
      </Card.Header>
      <Card.Body>
        <Card.Text>
          You need to login to access this page. Please <a href="/login">login</a> or <a href="/register">register</a>{" "}
          to continue.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default LoginPrompt;
