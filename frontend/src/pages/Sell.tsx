import React, { useState, useEffect } from "react";
import "./Sell.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Card from "../types/Card";

const Sell: React.FC = () => {
    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 5,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4,
            },
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 400,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };
      
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null); 

    useEffect(() => {
        fetch("http://localhost:8000/api/cards/?page=1")
          .then((response) => response.json())
          .then((data) => {
            setCards(data.results);
          })
          .catch((error) => console.error("Error fetching cards:", error));
      }, []);

   
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl)
    };

  return (
    <>
      <h1>Sell</h1>
      <div className="Outline">
        <div className="cardSell">
            {selectedImage && (
            <img src={selectedImage} alt="Selected" className="image" />
            )}
        </div>
        <div className="sell">
            <div className="flex-container">
                <div><p>Starting Bid:</p></div>
                <div>
                    <input type="text" placeholder="Type here..." className="inputBox" />
                </div>
                <div><p>Buy Now:</p></div>
                <div>
                    <input type="text" placeholder="Type here..." className="inputBox" />
                </div>  
                <div>
                <button  type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Sell</button>

                </div>
            </div>

        </div>
        <Slider {...settings} className="slider">
          {cards.map((card) => (
            <div key={card.id}>
              <img 
                src={card.image_url} 
                alt={card.name} 
                className="card-img"
                onClick={() => handleImageClick(card.image_url)}
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Sell;
