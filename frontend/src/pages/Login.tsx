import React from "react";

import { Button, Form, Card, Alert } from "react-bootstrap";

import { useAtom } from "jotai";
import { userIdAtom } from "../atoms/userIdAtom";

const Login = () => {
  const [userId, setUserId] = useAtom(userIdAtom);
  const [loginFailed, setLoginFailed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = form.elements.namedItem("formBasicEmail") as HTMLInputElement;
    const password = form.elements.namedItem("formBasicPassword") as HTMLInputElement;

    console.log("Attempting to login...");
    console.log("Email:", email.value);
    console.log("Password:", password.value);

    //TODO: Implement login logic here
    setLoginFailed(true);
  };
  return (
    <div>
      <h1>Login</h1>
      <Card
        style={{
          maxWidth: "min(500px, 90%)",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Remember me?" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            {loginFailed && (
              <Alert style={{ margin: "10px" }} variant="danger">
                Login failed. Please check your credentials and try again.
              </Alert>
            )}
          </Form>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            Don't have an account? <a href="/register">Register here</a>
          </small>
        </Card.Footer>
      </Card>

      <p style={{ marginTop: "50px" }}>
        DEBUGGING:&nbsp;
        {userId
          ? "You are logged in with userId: " + userId
          : "You are not logged in. Enter a userId below to simulate login."}
      </p>
      <input
        type="text"
        placeholder="Enter userId to simulate login"
        style={{ width: "300px", padding: "5px", margin: "10px" }}
        onChange={(e) => {
          const value = e.target.value;
          if (value) {
            setUserId(value);
          } else {
            setUserId("");
          }
        }}
      />
    </div>
  );
};

export default Login;
