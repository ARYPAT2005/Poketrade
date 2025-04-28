import React, { useState, useRef, useEffect } from "react";

import { Navbar, Card, Form, Button, InputGroup, Spinner, Alert } from "react-bootstrap";

import userAtom from "../atoms/userAtom";
import { useAtom } from "jotai";

import grassTemplate from "../assets/card_templates/grass_template.png";
import fireTemplate from "../assets/card_templates/fire_template.png";
import waterTemplate from "../assets/card_templates/water_template.png";
import lightningTemplate from "../assets/card_templates/lightning_template.png";
import default_portrait from "../assets/default_portrait.png";

import { PhoneLandscape, InfoCircle, Download, BrushFill, ExclamationTriangle } from "react-bootstrap-icons";

import html2canvas from "html2canvas";

import LoginPrompt from "./LoginPrompt";

const generation_cost = 500;

/*
Test input 1:
Name: Red Dragon
Description: A fierce red dragon with glowing eyes and sharp claws, soaring through the sky.
Abilities: 
- Fire resistance: The dragon is resistant to fire attacks.
- Flight: The dragon can fly at high speeds.
Attack:
- Fire Breath: The dragon can unleash a powerful fire breath attack.
- Claw Slash: The dragon can slash with its claws, dealing damage to enemies.
- Tail Whip: The dragon can use its tail to whip enemies, dealing damage.
- Wing Attack: The dragon can use its wings to create a gust of wind, knocking enemies back.
*/
/*
Test input 2:
Name: Water Spirit
Description: A mystical water spirit with flowing hair and a serene expression, surrounded by bubbles.
Abilities:
- Water manipulation: The spirit can control water and create waves.
- Healing: The spirit can heal allies with water magic.
Attack:
- Water Blast: The spirit can shoot a powerful blast of water at enemies.
- Bubble Shield: The spirit can create a shield of bubbles to protect itself.
- Aqua Jet: The spirit can move quickly through water, dodging attacks.
- Misty Veil: The spirit can create a veil of mist to obscure its presence.
*/
/*
Test input 3:
Name: Thunder Wolf
Description: A fierce wolf with lightning bolts in its fur, howling at the moon.
Abilities:
- Lightning speed: The wolf can move at incredible speeds.
- Night vision: The wolf can see clearly in the dark.
Attack:
- Thunder Strike: The wolf can unleash a powerful lightning attack.
- Bite: The wolf can bite enemies, dealing damage.
- Howl: The wolf can howl to intimidate enemies.
- Pounce: The wolf can leap at enemies, dealing damage.
*/
/*
Test input 4:
Name: Forest Squirrel
Description: A cute squirrel with big eyes and fluffy tail, sitting on a branch.
Abilities:
- Agility: The squirrel can move quickly and nimbly.
- Camouflage: The squirrel can blend in with its surroundings.
Attack:
- Nut Throw: The squirrel can throw nuts at enemies, dealing damage.
- Tail Whip: The squirrel can use its tail to whip enemies, dealing damage.
- Climb: The squirrel can climb trees and walls to escape danger.
- Jump: The squirrel can jump high to avoid attacks.
*/

const Creator: React.FC = () => {
  const screenshotRef = useRef(null);

  const takeScreenshot = async () => {
    if (screenshotRef.current) {
      try {
        const canvas = await html2canvas(screenshotRef.current);
        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = `${title || "screenshot"}.png`;
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error capturing screenshot:", error);
      }
    }
  };
  // takeScreenshot wasn't being used so:
  console.log(takeScreenshot);
  const downloadGeneratedImage = async () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `${title || "generated_image"}.png`;
      document.body.appendChild(link);
      link.click();
    }
  };
  type CardType = "grass" | "fire" | "water" | "lightning";
  const [cardType, setCardType] = useState<CardType>("grass");

  const [user, setUser] = useAtom(userAtom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [abilitiesAndAttacks, setAbilitiesAndAttacks] = useState("");

  // state variables for image generation
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800); // NOTE: Cannot be replaced with isMobile in navbar since they have different thresholds
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOrientationChange = () => {
      console.log("Orientation changed", window.screen.orientation.type);
      setIsMobile(!isMobile);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    return () => window.removeEventListener("orientationchange", handleOrientationChange);
  }, []);

  useEffect(() => {
    console.log(`isMobile: ${isMobile}`);
  }, [isMobile]);

  const generatePrompt = (type: CardType) => {
    const prompts = {
      grass:
        "A detailed pokemon style portrait of a cute grass-type fantasy creature in a lush forest setting, vibrant colors",
      fire: "A detailed pokemon style portrait of a powerful fire-type fantasy creature with flames, in a fiery landscape", // "volcano is flagged by DALL-E as unsafe",
      water:
        "A detailed pokemon style portrait of a majestic water-type fantasy creature in an underwater or lake setting",
      lightning:
        "A detailed pokemon style portrait of an electric lightning-type fantasy creature with sparks in a stormy setting",
    };

    return prompts[type] + ` with the name "${title}" and description "${description}"`;
  };

  // Function to call DALL-E API
  const generateImage = async () => {
    if (!user || user.wallet_balance < generation_cost) {
      setError("Insufficient balance");
      return;
    }

    if (!title || !description) {
      setError("Please fill in both title and description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Get API key from environment or secure storage
      const apiKey = import.meta.env.VITE_DALL_E_API_KEY;

      if (!apiKey) {
        throw new Error("API key not found");
      }

      const prompt = generatePrompt(cardType);
      console.log("Generated prompt:", prompt);
      // return;

      const response = await fetch(
        "https://jwang-m9j09tsr-swedencentral.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": apiKey,
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            size: "1792x1024",
            style: "vivid",
            quality: "standard",
            n: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Assuming the API returns an image URL in data.data[0].url
      if (data.data && data.data[0] && data.data[0].url) {
        setGeneratedImage(data.data[0].url);

        fetch(`${import.meta.env.VITE_API_URL}/user/${user.username}/pay/${generation_cost}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
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
            const newUser = {
              ...user,
              wallet_balance: user.wallet_balance - generation_cost,
            };
            setUser(newUser);
          });
      } else {
        throw new Error("No image URL found in response");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1>Creator</h1>
      {user ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {isMobile ? (
            <Card
              style={{
                maxWidth: "min(500px, 90%)",
                margin: "auto",
                marginTop: "50px",
              }}
            >
              <Card.Header>
                <InfoCircle style={{ marginRight: "0.5em", marginBottom: "0.2em" }} />
                Rotate your Device
              </Card.Header>
              <Card.Body>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "20px" }}>
                  <PhoneLandscape
                    size={100}
                    style={{
                      borderRadius: "10px",
                      border: "solid black",
                      padding: "10px",
                      height: "auto",
                      marginBottom: "20px",
                    }}
                  />
                  <div>
                    <p>Please rotate your device to landscape mode to use the Creator.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
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
                  onChange={(e: any) => setCardType(e.target.value as CardType)}
                  style={{
                    width: "200px",
                    marginLeft: "10px",
                  }}
                  disabled={isGenerating}
                >
                  <option value="grass">Grass</option>
                  <option value="fire">Fire</option>
                  <option value="water">Water</option>
                  <option value="lightning">Lightning</option>
                </Form.Select>
                <Form>
                  {generation_cost} PokéCoins to Generate an Image
                  {user && (
                    <>
                      <Button
                        disabled={user.wallet_balance < generation_cost || isGenerating}
                        variant="primary"
                        onClick={generateImage}
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
                          <>
                            <BrushFill style={{ marginRight: "0.5em" }} />
                            Generate
                          </>
                        )}
                      </Button>
                      <Button
                        disabled={!generatedImage}
                        variant="secondary"
                        onClick={downloadGeneratedImage}
                        style={{
                          marginLeft: "10px",
                          cursor: generatedImage ? "pointer" : "not-allowed",
                        }}
                      >
                        <Download style={{ marginRight: "0.5em" }} />
                        Download
                      </Button>
                    </>
                  )}
                </Form>
              </Navbar>
              <Alert
                variant="warning"
                dismissible
                style={{
                  width: "80%",
                  margin: "auto",
                  marginBottom: "10px",
                  marginTop: "10px",
                  borderRadius: "5px",
                }}
              >
                <Alert.Heading>
                  <ExclamationTriangle style={{ marginRight: "0.5em" }} />
                  Important Note
                </Alert.Heading>
                <p>
                  The image generator has an aggressive safety filter. If you encounter a 400 error, modify your title
                  or description to avoid any language that may potentially be flagged as inappropriate.
                </p>
              </Alert>
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
              <div
                style={{
                  margin: "auto",
                  marginBottom: "30px",
                  width: "80%",
                  backgroundColor: "white",
                  borderRadius: "20px",
                  height: "200px",
                  padding: "20px",
                }}
              >
                <Form>
                  <Form.Control
                    placeholder="Image generation description"
                    aria-label="Description"
                    as="textarea"
                    rows={5}
                    style={{
                      background: "transparent",
                      fontSize: "20px",
                      width: "100%",
                      height: "100%",
                    }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Form>
              </div>
              <div style={{ position: "relative", width: "600px", height: "auto", margin: "auto" }} ref={screenshotRef}>
                <InputGroup>
                  <Form.Control
                    placeholder="Title"
                    aria-label="Title"
                    style={{
                      position: "absolute",
                      top: "30px",
                      left: "100px",
                      height: "40px",
                      width: "400px",
                      background: "transparent",
                      fontFamily: "Gill Sans",
                      fontSize: "30px",
                      fontWeight: "bold",
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Form.Control
                    placeholder="Abilities and Attacks"
                    aria-label="Abilities and Attacks"
                    as="textarea"
                    style={{
                      position: "absolute",
                      top: "430px",
                      left: "51px",
                      width: "503px",
                      height: "270px",
                      background: "transparent",
                      fontFamily: "Gill Sans",
                      fontSize: "20px",
                    }}
                    value={abilitiesAndAttacks}
                    onChange={(e) => setAbilitiesAndAttacks(e.target.value)}
                  />
                </InputGroup>

                {/* DALL-E only generates images of '1024x1024', '1792x1024', and'1024x1792', so we have to crop the image a bit*/}

                <Card.Img
                  src={generatedImage || default_portrait}
                  style={{
                    position: "absolute",
                    top: "84px",
                    left: "50px",
                    width: "504px",
                    height: "314px",
                    zIndex: 2, // Ensure it overlays the card image
                    objectFit: "cover",
                    borderRadius: "2px",
                  }}
                />
                <Card.Img
                  variant="top"
                  aria-label="Card Image"
                  src={
                    cardType === "grass"
                      ? grassTemplate
                      : cardType === "fire"
                      ? fireTemplate
                      : cardType === "water"
                      ? waterTemplate
                      : lightningTemplate
                  }
                  style={{
                    width: "600px",
                    height: "auto",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
};

export default Creator;
