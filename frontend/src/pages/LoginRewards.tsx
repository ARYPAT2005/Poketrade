import React, { useState, useEffect } from "react";

import userIdAtom from "../atoms/userIdAtom";
import userAtom from "../atoms/userAtom";

import { useAtomValue, useAtom } from "jotai";

import { Card, Alert } from "react-bootstrap";
import "./OpenAnimation.css";
import pokeball from "../assets/individual_pokeball.svg";

import LoginPrompt from "./LoginPrompt";

const LoginRewards: React.FC = () => {
  const userId = useAtomValue(userIdAtom);
  const [user, setUser] = useAtom(userAtom);

  const [earned, setEarned] = useState(0);
  useEffect(() => {
    if (userId) {
      fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Wallet data:", data);
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data");
        });
    }
  }, [userId]);

  const calculateTimeRemaining = () => {
    if (user?.last_claim_date) {
      const now = new Date();
      const lastClaim = new Date(user.last_claim_date);

      const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
      const timeDiff = now.getTime() - lastClaim.getTime();

      if (timeDiff >= millisecondsIn24Hours) {
        return "0 hours and 0 minutes";
      }

      // Time remaining until 24 hours have passed
      const timeRemaining = millisecondsIn24Hours - timeDiff;

      const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
      const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

      return `${hours} hours and ${minutes} minutes`;
    }

    return "0 hours and 0 minutes";
  };

  const handleRewardClaim = () => {
    if (!userId) return;
    fetch(`${import.meta.env.VITE_API_URL}/claim/${userId}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Reward claimed:", data);
        if (!data || !user) {
          return;
        }
        const newUser = {
          ...user,
          wallet_balance: data.wallet_balance,
          last_claim_date: new Date(data.last_claim_date),
        };

        setUser(newUser);
        setEarned(data.amount_claimed);
      })
      .catch((error) => {
        console.error("Error claiming reward:", error);
        alert("Failed to claim the reward. Please try again later.");
      });
  };

  return (
    <div>
      <h1>Login Reward</h1>
      {userId ? (
        <Card
          style={{
            maxWidth: "min(1000px, 90%)",
            margin: "auto",
            marginTop: "50px",
          }}
        >
          <Card.Body>
            <Card.Title
              style={{
                textAlign: "end",
              }}
            >
              Current Balance:
              {" $" + user?.wallet_balance}
            </Card.Title>
            {user?.can_claim ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                {earned !== 0 ? (
                  <>
                    <Alert variant="success">Congratulations! You have earned ${earned}!</Alert>
                  </>
                ) : (
                  <>
                    <img
                      className="blinking-image"
                      src={pokeball}
                      alt="Pokeball"
                      width="300"
                      onClick={handleRewardClaim}
                      style={{
                        cursor: "pointer",
                        marginBottom: "30px",
                      }}
                    />
                    <p>Click the pokéball to claim your daily login reward</p>
                  </>
                )}
              </div>
            ) : (
              <Alert variant="danger">You must wait {calculateTimeRemaining()} before claiming your next reward.</Alert>
            )}
          </Card.Body>
        </Card>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default LoginRewards;
