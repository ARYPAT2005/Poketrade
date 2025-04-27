import { useState, useEffect, useRef } from "react";
import { Form, Navbar } from "react-bootstrap";
import "./search.css";
import CardDetails from "../components/CardDetails";
import PokemonCard from "../types/Card";

const Search = () => {
  const [allCards, setAllCards] = useState<any[]>([]);
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [inputText, setInputText] = useState<string>("");

  const handleCardEnlarge = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseOverlay = () => {
    setSelectedCard(null);
  };

  useEffect(() => {
    const searchBar = searchRef.current;

    if (searchBar) {
      const handleKeyUp = (e: KeyboardEvent) => {
        const searchText = (e.target as HTMLInputElement).value.toLowerCase();
        setInputText(searchText);

        fetch(`${import.meta.env.VITE_API_URL}/search/?q=` + searchText)
          .then((response) => response.json())
          .then((data) => {
            setAllCards(data.results);
            setFilteredCards(data.results);
          });
      };

      searchBar.addEventListener("keyup", handleKeyUp);

      return () => {
        searchBar.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [allCards]);

  return (
    <div>
      <h1>Search</h1>
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
            <Form
              className="d-flex"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" ref={searchRef} />
            </Form>
          </Navbar>

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
            <h2>Search Results</h2>
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
              {filteredCards.length > 0 ? (
                filteredCards.map((card) => (
                  <img
                    key={card.id}
                    src={card.image_url}
                    style={{ cursor: "pointer", margin: "10px" }}
                    onClick={() => handleCardEnlarge(card)}
                    alt={card.name}
                    width="300"
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  {
                    <p>
                      {inputText.length > 0
                        ? `No results found for "${inputText}"`
                        : "Please enter a search term to see results."}
                    </p>
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseOverlay} />}
    </div>
    // <>
    //   <nav className="navbar navbar-light bg-red">
    //     <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
    //       <input
    //         ref={searchRef}
    //         className="form-control mr-sm-2"
    //         type="search"
    //         placeholder="Search"
    //         aria-label="Search"
    //       />
    //     </form>
    //   </nav>
    //   <div className="card-Containers">
    //     {filteredCards.map((card) => (
    //       <img
    //         key={card.id}
    //         src={card.image_url}
    //         style={{ cursor: "pointer" }}
    //         onClick={() => handleCardEnlarge(card)}
    //         alt={card.name}
    //         width="300"
    //       />
    //     ))}
    //   </div>
    //   {selectedCard && <CardDetails card={selectedCard} onClose={handleCloseOverlay} />}
    // </>
  );
};

export default Search;
