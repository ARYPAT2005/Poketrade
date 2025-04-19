import React, { useState, useEffect } from "react";

// import Card from "../types/Card";

import { Navbar, Form, Button, Spinner, Alert } from "react-bootstrap";
import LoginPrompt from "./LoginPrompt";

import userAtom from "../atoms/userAtom";
import { useAtom } from "jotai";

const environments = [
  {
    name: "forest",
    desc: "A dense forest with towering trees and hidden paths.",
  },
  {
    name: "mountain",
    desc: "A rocky mountain range with steep cliffs and hidden caves.",
  },
  {
    name: "desert",
    desc: "A vast desert with rolling dunes and scorching sun.",
  },
  {
    name: "ocean",
    desc: "A deep ocean with mysterious creatures lurking beneath the waves.",
  },
  {
    name: "cave",
    desc: "A dark cave filled with echoes and hidden treasures.",
  },
];

const results = [
  {
    code: "MajorLoss",
    desc: "Major Loss",
    color: "#ff6b6b",
  },
  {
    code: "Loss",
    desc: "Loss",
    color: "#ffc3a0",
  },
  {
    code: "Tie",
    desc: "Tie",
    color: "#f8f9fa",
  },
  {
    code: "Win",
    desc: "Win",
    color: "#c3fdb8",
  },
  {
    code: "MajorWin",
    desc: "Major Win",
    color: "#63e6be",
  },
];

const Battles: React.FC = () => {
  const [user, setUser] = useAtom(userAtom);
  const [selectedEnvironment, setSelectedEnvironment] = useState(environments[0]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New state variables for battle results
  const [battleNarrative, setBattleNarrative] = useState<string>("");
  const [battleOutcome, setBattleOutcome] = useState<string | null>(null);
  const [amountWonLost, setAmountWonLost] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const generatePrompt = () => {
    if (selectedCards.length <= 0) {
      setError("Please select at least one card.");
      return null;
    }
    if (!user) {
      setError("Please log in to generate a prompt.");
      return null;
    }

    const selectedCardsDetails = selectedCards.map((card) => {
      const [id, index] = card.split("-");
      const cardDetails = user.owned_cards.find((c) => c.id === parseInt(id));
      if (cardDetails) {
        return {
          ...cardDetails,
          index: parseInt(index),
        };
      }
      return null;
    });
    console.log("Selected Cards Details:", JSON.stringify(selectedCardsDetails));

    const prompt = `The user currently has the following balance: ${
      user.wallet_balance
    }.\nYou are to generate a battle scenario in which the user encounters and battles a wild creature in the 
    ${selectedEnvironment.name} environment with the following cards: \n${JSON.stringify(selectedCardsDetails)}\n 
    All cards should be used in the battle. The battle scenario should be between 3-5 paragraphs long. \nThe last two outputs, on a newline, separated by a space, of the scenario should be in the format "{code} {won/lost}". 
    Code is one of the following: "MajorLoss", "Loss", "Tie", "Win", "MajorWin". The probabilities are the following: 
    MajorLoss: 0.15, Loss: 0.3, Tie: 0.1, Win: 0.3, MajorWin: 0.15.
    Won/Lost should be an integer between -1000 and 1000, representing the amount of money the user won or lost in the battle and is dependent on the code. The user should not lose more than their current balance. The user should not win more than their current balance.`;

    return prompt;
  };

  const handleGenerate = async () => {
    if (!user) {
      setError("Please log in to generate a prompt.");
      return;
    }
    const prompt = generatePrompt();
    if (!prompt) return;
    console.log("Generated prompt:", prompt);

    setIsGenerating(true);
    setShowResults(false);
    setBattleNarrative("");
    setBattleOutcome(null);
    setAmountWonLost(null);

    try {
      const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
      if (!apiKey) {
        throw new Error("API key is not set");
      }

      const response = await fetch(
        "https://ai-jwang34501568ai548368912875.openai.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            max_completion_tokens: 800,
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            model: "gpt-4.1",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in response");
      }

      console.log("ChatGPT response:", content);

      // Parse battle narrative and outcome
      const contentLines = content.trim().split("\n");

      // The last two lines should contain our battle result codes
      const lastLine = contentLines[contentLines.length - 1];
      const secondLastLine = contentLines[contentLines.length - 2];

      // Try to extract the outcome code and amount from either the last or second last line
      const lastLineMatch = lastLine.match(/(MajorLoss|Loss|Tie|Win|MajorWin)\s+(-?\d+)/);
      const secondLastLineMatch = secondLastLine.match(/(MajorLoss|Loss|Tie|Win|MajorWin)\s+(-?\d+)/);

      const match = lastLineMatch || secondLastLineMatch;

      if (match) {
        const [, outcome, amount] = match;
        setBattleOutcome(outcome);
        setAmountWonLost(Number(amount));
        console.log(amountWonLost);

        // Remove the result lines from the narrative
        const narrativeLines = lastLineMatch ? contentLines.slice(0, -1) : contentLines.slice(0, -2);

        setBattleNarrative(narrativeLines.join("\n"));
        if (user && amount) {
          let paymentUrl = `${import.meta.env.VITE_API_URL}/user/${user.username}/${
            Number(amount) >= 0 ? "earn" : "pay"
          }/${Number(amount)}/`;
          fetch(paymentUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.username,
              amount: Number(amount),
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
              const newBalance: number = Number(user.wallet_balance) + Number(amount);
              setUser({
                ...user,
                wallet_balance: newBalance,
              });
            });
        }
      } else {
        // If we couldn't extract the outcome format, just display the whole response
        setBattleNarrative(content);
        setError("Couldn't parse battle outcome. Please try again.");
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error generating battle:", error);
      setError(`Failed to generate battle. ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    console.log("selected cards", selectedCards);
  }, [selectedCards]);

  return (
    <div>
      <h1>Battles</h1>
      {user ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "20px",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              backgroundColor: "#e3a9a9",
              borderRadius: "20px",
              borderWidth: "5px",
              borderColor: "solid black",
              width: "80%",
              textAlign: "center",
              padding: "20px",
            }}
          >
            <Navbar
              style={{
                width: "80%",
                height: "auto",
                margin: "auto",
                marginBottom: "20px",
                borderRadius: "10px",
                padding: "10px",
              }}
              className="bg-body-tertiary justify-content-between"
            >
              <Form.Select
                style={{
                  width: "200px",
                  marginRight: "10px",
                }}
                aria-label="Select Environment"
                onChange={(e) => {
                  const selected = environments.find((env) => env.name === e.target.value);
                  if (selected) {
                    setSelectedEnvironment(selected);
                  }
                }}
                disabled={isGenerating}
              >
                {environments.map((env) => (
                  <option key={env.name} value={env.name}>
                    {env.name.charAt(0).toUpperCase() + env.name.slice(1)}
                  </option>
                ))}
              </Form.Select>
              <Form
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <>
                  <Button
                    disabled={isGenerating || selectedCards.length === 0}
                    variant="primary"
                    onClick={handleGenerate}
                    style={{
                      marginLeft: "10px",
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        {" Generating..."}
                      </>
                    ) : (
                      <>Start Battle</>
                    )}
                  </Button>
                </>
              </Form>
            </Navbar>
            {error && (
              <Alert
                variant="danger"
                onClose={() => setError(null)}
                dismissible
                style={{
                  width: "80%",
                  margin: "auto",
                  marginBottom: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                }}
              >
                {error}
              </Alert>
            )}

            {/* Battle Results Display */}
            {showResults && battleNarrative && (
              <div
                style={{
                  width: "80%",
                  margin: "auto",
                  marginBottom: "20px",
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  textAlign: "left",
                }}
              >
                <h2>
                  Battle in the {selectedEnvironment.name.charAt(0).toUpperCase() + selectedEnvironment.name.slice(1)}
                </h2>
                <div style={{ whiteSpace: "pre-wrap" }}>{battleNarrative}</div>

                {battleOutcome && amountWonLost !== null && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      borderRadius: "10px",
                      // backgroundColor: outcomeColors[battleOutcome as keyof typeof outcomeColors] || "#f8f9fa",
                      backgroundColor: results.find((result) => result.code === battleOutcome)?.color || "#f8f9fa",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    <h3>Battle Outcome: {results.find((result) => result.code === battleOutcome)?.desc}</h3>
                    <p style={{ fontSize: "24px", margin: "5px 0" }}>
                      {amountWonLost >= 0
                        ? `You won ${amountWonLost} coins!`
                        : `You lost ${Math.abs(amountWonLost)} coins!`}
                    </p>
                    <p>New Balance: {user.wallet_balance} coins</p>
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                margin: "auto",
                marginBottom: "30px",
                width: "80%",
                backgroundColor: "white",
                borderRadius: "20px",
                height: "auto",
                padding: "20px",
              }}
            >
              <h2>Card Selection</h2>
              <p>Select the cards you want to use in the battle.</p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  maxHeight: "800px",
                  padding: "1px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                }}
              >
                {user.owned_cards.map((card) =>
                  Array.from({ length: card.quantity }).map((_, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      style={{
                        border: "1px solid black",
                        borderRadius: "10px",
                        padding: "10px",
                        marginBottom: "10px",
                        margin: "10px",
                        backgroundColor: selectedCards.includes(`${card.id}-${index}`) ? "#d1ffd1" : "#fff",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        width: "195px",
                        height: "300px",
                      }}
                      onClick={() => {
                        if (isGenerating) return;
                        const cardKey = `${card.id}-${index}`;
                        console.log("Card clicked:", cardKey);
                        if (selectedCards.includes(cardKey)) {
                          setSelectedCards(selectedCards.filter((c) => c !== cardKey));
                        } else {
                          setSelectedCards([...selectedCards, cardKey]);
                        }
                      }}
                    >
                      <h3>{card.card_details.name}</h3>
                      <img
                        key={`${card.card_details.id}-${card.card_details.name}-${index}`}
                        src={card.card_details.image_url}
                        alt={card.card_details.name}
                        width="100px"
                        style={{
                          margin: "5px",
                        }}
                      />
                      <p>Hp: {card.card_details.hp}</p>
                      <p>Rarity: {card.card_details.rarity}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Battles;
