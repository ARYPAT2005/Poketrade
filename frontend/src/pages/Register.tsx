import React, { useEffect, useState } from "react"
import { Button, Form, Card, Alert, InputGroup } from "react-bootstrap"
import { useAtomValue } from "jotai"
import { isLoggedAtom } from "../atoms/isLoggedAtom"
import { useNavigate } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate();

  const isLogged = useAtomValue(isLoggedAtom);
  const [validated, setValidated] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [error, setError] = useState("");

  // Regular expressions for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
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
      event.preventDefault();
      // Proceed with form submission (e.g., API call)
      try {
        const response = await fetch("http://127.0.0.1:8000/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            confirm_password: confirmPassword
          }),
        });
        if (response.status === 400) {
          try {
              const errorData = await response.json();
              if (errorData.email) {
                  setError("Email already exists. Please use a different email.");
              } else if (errorData.username) {
                  setError("Username already taken. Try another one.");
              } else {
                  setError("Registration failed. Please check your details.");
              }
          } catch (error) {
              setError("An unexpected error occurred.");
          }
          return; // Exit function to prevent further execution
      }
        let data;
        try {
            data = await response.json(); // Read JSON once
        } catch (error) {
            console.error("Failed to parse JSON response:", error);
            data = null; // Handle cases where response isn't JSON
        }
  
        if (response.ok) {
          setRegisterSuccess(true);
          setRegisterFailed(false);
          // Clear form
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          navigate("http://127.0.0.1:5173/login");
        } else {
          const data = await response.json();
          handleBackendErrors(data);
        }
      } catch (error) {
        console.error("Registration error:", error);
        setRegisterFailed(true);
        setRegisterSuccess(false);
        setPasswordError("Server error. Please try again later.");
      }
    }
  };

  const handleBackendErrors = (errorData: any) => {
    if (errorData.errors) {
      // Handle serializer errors
      if (errorData.errors.email) {
        setEmailError(errorData.errors.email[0]);
      }
      if (errorData.errors.password) {
        setPasswordError(errorData.errors.password[0]);
      }
    } else if (errorData.error) {
      // Handle server errors
      setPasswordError(errorData.error);
    } else {
      setPasswordError("Unknown error occurred");
    }
  };

  useEffect(() => {
    console.log("isLogged:", isLogged);
  }, [isLogged]);

  return (
    <div>
      <h1>Register</h1>
      <Card style={{ maxWidth: "min(500px, 90%)", margin: "auto", marginTop: "50px" }}>
        {isLogged ? (
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
              {registerFailed && (
              <Alert variant="danger" style={{ marginTop: "10px" }}>
                {emailError || passwordError || "Registration failed. Please try again."}
              </Alert>
            )}
            {registerSuccess && (
              <Alert variant="success">
                Registration successful! Please log in.
              </Alert>
            )}
            {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default Register;