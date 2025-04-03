import React from "react";

import { Button, Form, Card, Alert } from "react-bootstrap";

import { useAtom } from "jotai";
import { isLoggedAtom, usernameAtom} from "../atoms/isLoggedAtom";
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [isLogged, setIsLogged] = useAtom(isLoggedAtom);
  const [loginFailed, setLoginFailed] = React.useState(false);
  const [, setUsername] = useAtom(usernameAtom);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();
  interface LoginResponse {
    message: string;
    user: string;
    email: string;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const email = form.elements.namedItem("formBasicEmail") as HTMLInputElement;
    const password = form.elements.namedItem("formBasicPassword") as HTMLInputElement;
    const data = {
      email: email.value,
      password: password.value,
    };
    console.log("Attempting to login...");
    console.log("Email:", data.email);
    console.log("Password:", data.password);

    //TODO: Implement login logic here
    try {
      const response: Response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed.");
      }
      const responseData: LoginResponse = await response.json();
      setUsername(responseData.user);
      console.log("Login successful!", responseData);
      setIsLogged(true);
      setLoginFailed(false);
      setError("");
      navigate("/");
    } catch (err: any) {
      setLoginFailed(true);
      setError(err.message || "An unexpected error occurred.");
      console.error("Login error:", err);
    }
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
        {isLogged
          ? "You are logged in. Click the button below to logout."
          : "You are not logged in. Click the button below to login."}
      </p>
      <Button
        onClick={() => {
          setIsLogged(!isLogged);
        }}
        variant={isLogged ? "danger" : "success"}
      >
        {isLogged ? "Logout" : "Login"}
      </Button>
    </div>
  );
};

export default Login;
