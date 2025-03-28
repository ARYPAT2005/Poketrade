import React, { useEffect, useState } from "react";
import "./About.css";
const About = () => {
 const [cardImage, setCards] = useState<any[]>([]);


 useEffect(() => {
   fetch("http://localhost:8000/api/cards/?page=1")
     .then((response) => response.json())
     .then(data => setCards(data.data))
     .catch((error) => console.error("Error fetching card:", error));
 }, []);


 return (
   <>
   <div className ="Visible">
     <h1 className="About">About PokéTrade</h1>
     <p className="Description">PokéTrade is a web application where users can collect, trade, and manage Pokémon in a fun and interactive way. The idea is to create a simple experience, similar to collectible card games, but with a focus on trading instead of complex battles.</p>
   </div>
   <div className = "card-Container">
     {cardImage.map((card) => (
     <img src={card.images.small} alt={card.name} width="300" />
     ))}
   </div>
   </>
 );
}
export default About;