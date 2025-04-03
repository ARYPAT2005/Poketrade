import React, { useEffect, useState } from "react";
import "./Messages.css";
import { userIdAtom } from "../atoms/userIdAtom";
import { useAtomValue } from "jotai";

import { Tabs, Tab, Card, ListGroup, Form, InputGroup, Button, Alert } from "react-bootstrap";
import { CircleFill } from "react-bootstrap-icons";

import LoginPrompt from "./LoginPrompt";

interface Message {
  id: number;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: Date;
  is_read: boolean;
}

const Messages: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [inboxMessages, setInboxMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [selectedSentMessage, setSelectedSentMessage] = useState<Message | null>(null);

  const [composeValidated, setComposeValidated] = useState(false);
  const [composeRecipient, setComposeRecipient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [compositionSuccess, setCompositionSuccess] = useState(false);

  const [recipientError, setRecipientError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [bodyError, setBodyError] = useState("");

  const handleMessageClick = async (message: Message) => {
    console.log("Message clicked:", message);
    if (!message.is_read) {
      console.log("Updating message read status");
      const response = await updateMessageReadStatus(message.id);
      const updatedMessages = inboxMessages.map((msg) => (msg.id === message.id ? { ...msg, is_read: true } : msg));
      setInboxMessages(updatedMessages);
    }
    setSelectedMessage(message);
  };

  const handleSentMessageClick = (message: Message) => {
    console.log("Sent message clicked:", message);
    setSelectedSentMessage(message);
  };

  const updateMessageReadStatus = (messageId: number) => {
    fetch(`http://127.0.0.1:8000/api/message/${messageId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ is_read: true }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return 0;
      })
      .catch((error) => {
        console.error("Error updating message read status:", error);
      });
  };

  const handleMessageDelete = (messageId: number) => {
    fetch(`http://127.0.0.1:8000/api/message/${messageId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setInboxMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
        setSelectedMessage(null);
      })
      .catch((error) => {
        console.error("Error deleting message:", error);
      });
  };

  const handleComposeReset = () => {
    setComposeRecipient("");
    setComposeSubject("");
    setComposeBody("");
    setRecipientError("");
    setSubjectError("");
    setBodyError("");
    setComposeValidated(false);
  };

  const handleComposeSend = (event: React.FormEvent<HTMLFormElement>) => {
    let valid = true;

    // TODO: Check if recipient is a valid user
    if (!composeRecipient.trim()) {
      setRecipientError("Recipient is required.");
      valid = false;
    } else {
      setRecipientError("");
    }

    if (!composeSubject.trim()) {
      setSubjectError("Subject is required.");
      valid = false;
    } else {
      setSubjectError("");
    }

    if (!composeBody.trim()) {
      setBodyError("Message body is required.");
      valid = false;
    } else {
      setBodyError("");
    }

    if (valid) {
      setComposeValidated(true);
      fetch(`http://127.0.0.1:8000/api/messages/send/${userId}/${composeRecipient}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: composeSubject,
          body: composeBody,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Message sent successfully:", data);
          setComposeRecipient("");
          setComposeSubject("");
          setComposeBody("");
          setRecipientError("");
          setSubjectError("");
          setBodyError("");
        })
        .catch((error) => {
          console.error("Error sending message:", error);
          alert("Error sending message. Please try again.");
        });
    }
  };

  useEffect(() => {
    if (userId) {
      fetch(`http://127.0.0.1:8000/api/messages/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setInboxMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      // 127.0.0.1:8000/api/messages/admin/sent/
      fetch(`http://127.0.0.1:8000/api/messages/${userId}/sent`)
        .then((response) => response.json())
        .then((data) => {
          setSentMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    console.log("messages", inboxMessages);
  }, [inboxMessages]);
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
            <Tabs
              defaultActiveKey="inbox"
              id="justify-tab-example"
              className="mb-3"
              style={{ maxWidth: "min(1000px, 90%)", margin: "auto" }}
            >
              <Tab eventKey="inbox" title="Inbox">
                {inboxMessages.length === 0 ? (
                  <Card.Body>
                    <p>Your inbox is empty.</p>
                  </Card.Body>
                ) : (
                  <div className="message-container">
                    <div className="message-list">
                      <ListGroup
                        style={{
                          maxHeight: "500px",
                          overflowY: "auto",
                          background: "white",
                          borderRadius: "5px",
                        }}
                        variant="flush"
                      >
                        {/* <ListGroup.Item>
                        {" "}
                        <CircleFill className="text-primary" /> Message from John Doe
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Badge bg="secondary">Read</Badge> Message from Jane Smith
                      </ListGroup.Item> */}
                        {inboxMessages.map((message) => (
                          <ListGroup.Item
                            style={{ cursor: "pointer" }}
                            key={message.id}
                            onClick={() => handleMessageClick(message)}
                            action
                            variant={selectedMessage?.id === message.id ? "dark" : ""}
                            className="d-flex justify-content-between align-items-start"
                          >
                            <div className="ms-2 me-auto">
                              <div className="fw-bold">{message.sender.trim() ? message.sender : "Unknown Sender"}</div>
                              <span className="text-muted">
                                {message.subject.trim() ? message.subject : "No Subject"}{" "}
                              </span>
                            </div>

                            {!message.is_read ? (
                              <CircleFill
                                className="text-primary float-end"
                                style={{ marginRight: "10px", fontSize: "20px", padding: "3px" }}
                              />
                            ) : null}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                    <div className="message-inputs">
                      <div
                        style={{
                          minWidth: "100%",
                          padding: "10px",
                          height: "100%",
                          background: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <ListGroup>
                          {selectedMessage ? (
                            <>
                              <ListGroup.Item
                                style={{
                                  height: "40px",
                                }}
                              >
                                <h5>
                                  {selectedMessage.subject}
                                  <span className="float-end text-muted">
                                    {new Date(selectedMessage.timestamp).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </h5>
                              </ListGroup.Item>
                              <ListGroup.Item
                                style={{
                                  height: "35px",
                                }}
                              >
                                <p>
                                  <strong>From:</strong> {selectedMessage.sender}
                                </p>
                              </ListGroup.Item>
                              <ListGroup.Item
                                style={{
                                  height: "35px",
                                }}
                              >
                                <p>
                                  <strong>To:</strong> {selectedMessage.recipient}
                                </p>
                              </ListGroup.Item>

                              <ListGroup.Item
                                style={{
                                  minHeight: "300px",
                                  overflowY: "auto",
                                  background: "white",
                                  borderRadius: "5px",
                                }}
                              >
                                <p>{selectedMessage.body}</p>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Button variant="secondary" onClick={() => setSelectedMessage(null)}>
                                  Back to Inbox
                                </Button>
                                <Button
                                  variant="danger"
                                  style={{ marginLeft: "10px" }}
                                  onClick={() => handleMessageDelete(selectedMessage.id)}
                                >
                                  Delete
                                </Button>
                              </ListGroup.Item>
                            </>
                          ) : (
                            <Card.Body style={{ textAlign: "center" }}>
                              <h5>Select a message to view details</h5>
                            </Card.Body>
                          )}
                        </ListGroup>
                      </div>
                    </div>
                  </div>
                )}
              </Tab>
              <Tab eventKey="sent" title="Sent">
                {sentMessages.length > 0 ? (
                  <div className="message-container">
                    <div className="message-list">
                      <ListGroup
                        style={{
                          maxHeight: "500px",
                          overflowY: "auto",
                          background: "white",
                          borderRadius: "5px",
                        }}
                        variant="flush"
                      >
                        {/* <ListGroup.Item>
                        {" "}
                        <CircleFill className="text-primary" /> Message from John Doe
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Badge bg="secondary">Read</Badge> Message from Jane Smith
                      </ListGroup.Item> */}
                        {inboxMessages.map((message) => (
                          <ListGroup.Item
                            style={{ cursor: "pointer" }}
                            key={message.id}
                            onClick={() => handleSentMessageClick(message)}
                            action
                            variant={selectedSentMessage?.id === message.id ? "dark" : ""}
                          >
                            {message.subject.trim() ? message.subject : "No Subject"}{" "}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                    <div className="message-inputs">
                      <div
                        style={{
                          minWidth: "100%",
                          padding: "10px",
                          height: "100%",
                          background: "white",
                          borderRadius: "5px",
                        }}
                      >
                        <ListGroup>
                          {selectedSentMessage ? (
                            <>
                              <ListGroup.Item
                                style={{
                                  height: "40px",
                                }}
                              >
                                <h5>
                                  {selectedSentMessage.subject}
                                  <span className="float-end text-muted">
                                    {new Date(selectedSentMessage.timestamp).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </h5>
                              </ListGroup.Item>
                              <ListGroup.Item
                                style={{
                                  height: "35px",
                                }}
                              >
                                <p>
                                  <strong>From:</strong> {selectedSentMessage.sender}
                                </p>
                              </ListGroup.Item>
                              <ListGroup.Item
                                style={{
                                  height: "35px",
                                }}
                              >
                                <p>
                                  <strong>To:</strong> {selectedSentMessage.recipient}
                                </p>
                              </ListGroup.Item>
                              <ListGroup.Item
                                style={{
                                  minHeight: "300px",
                                  overflowY: "auto",
                                  background: "white",
                                  borderRadius: "5px",
                                }}
                              >
                                <p>{selectedSentMessage.body}</p>
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <Button variant="secondary" onClick={() => setSelectedSentMessage(null)}>
                                  Back to Sent
                                </Button>
                              </ListGroup.Item>
                            </>
                          ) : (
                            <Card.Body style={{ textAlign: "center" }}>
                              <h5>Select a message to view details</h5>
                            </Card.Body>
                          )}
                        </ListGroup>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Card.Body>
                    <p>Your sent messages are empty.</p>
                  </Card.Body>
                )}
              </Tab>
              <Tab eventKey="compose" title="Compose">
                <div style={{ minWidth: "100%", padding: "10px", background: "white", borderRadius: "5px" }}>
                  {compositionSuccess && (
                    <Alert variant="success" onClose={() => setCompositionSuccess(false)} dismissible>
                      Message sent successfully!
                    </Alert>
                  )}
                  <Form
                    noValidate
                    validated={composeValidated}
                    onSubmit={handleComposeSend}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Form.Group controlId="composeRecipient">
                      <InputGroup hasValidation>
                        <InputGroup.Text>To:</InputGroup.Text>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Recipient"
                          aria-label="Recipient"
                          value={composeRecipient}
                          onChange={(e) => setComposeRecipient(e.target.value)}
                          isInvalid={!!recipientError}
                        />
                        <Form.Control.Feedback type="invalid">{recipientError}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup hasValidation>
                        <InputGroup.Text>Subject:</InputGroup.Text>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Subject"
                          aria-label="Subject"
                          value={composeSubject}
                          onChange={(e) => setComposeSubject(e.target.value)}
                          isInvalid={!!subjectError}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <InputGroup>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          required
                          placeholder="Message"
                          aria-label="Message"
                          value={composeBody}
                          onChange={(e) => setComposeBody(e.target.value)}
                          isInvalid={!!bodyError}
                          style={{
                            height: "300px",
                            resize: "none",
                          }}
                        />
                        <Form.Control.Feedback type="invalid">{bodyError}</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group>
                      <Button variant="primary" type="submit">
                        Send
                      </Button>
                      <Button
                        variant="secondary"
                        type="reset"
                        style={{ marginLeft: "10px" }}
                        onClick={handleComposeReset}
                      >
                        Reset
                      </Button>
                    </Form.Group>
                  </Form>
                </div>
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

export default Messages;
