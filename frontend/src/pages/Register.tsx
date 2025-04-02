import React, { useEffect, useState } from "react";
import { Button, Form, Card, Alert, InputGroup } from "react-bootstrap";
import { useAtomValue } from "jotai";
import { userIdAtom } from "../atoms/userIdAtom";

const Register = () => {
  const userId = useAtomValue(userIdAtom);
  const [validated, setValidated] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    let valid = true;

    // Validate Username (Ensure it's not empty)
    if (!username.trim()) {
      setUsernameError("Username is required.");
      valid = false;
    } else {
      setUsernameError("");
    }

    // Validate Email
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    // Validate Password
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    // Validate Confirm Password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    // If all fields are valid, proceed with submission
    if (valid) {
      setValidated(true);
      console.log("Attempting to register...");
      // Proceed with form submission (e.g., API call)
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <Card style={{ maxWidth: "min(500px, 90%)", margin: "auto", marginTop: "50px" }}>
        {userId ? (
          <Card.Body>
            <Alert variant="success">You are already logged in.</Alert>
          </Card.Body>
        ) : (
          <Card.Body>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              {/* Username Field */}
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Username</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    isInvalid={!!usernameError}
                  />
                  <Form.Control.Feedback type="invalid">{usernameError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                  />
                  <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                  />
                  <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!confirmPasswordError}
                  />
                  <Form.Control.Feedback type="invalid">{confirmPasswordError}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default Register;
