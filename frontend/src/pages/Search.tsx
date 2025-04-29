import { useState, useEffect, useRef } from "react";
import { Form, Navbar, Card, Tabs, Tab, ListGroup } from "react-bootstrap";
import "./search.css";
import CardDetails from "../components/CardDetails";
import PokemonCard from "../types/Card";
import ApiService from "../services/ApiService";

const Search = () => {
  const [filteredCards, setFilteredCards] = useState<any[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<any[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  const apiService = ApiService.getInstance();

  const handleCardEnlarge = (card: PokemonCard) => {
    setSelectedCard(card);
  };

  const handleCloseOverlay = () => {
    setSelectedCard(null);
  };

  useEffect(() => {
    const searchBar = searchRef.current;

    if (searchBar) {
      const handleKeyUp = async(e: KeyboardEvent) => {
        const searchText = (e.target as HTMLInputElement).value.toLowerCase();
        setInputText(searchText);

        const fetchCards = await apiService.searchCards(searchText);
        setFilteredCards(fetchCards.results);
        const fetchUsers = await apiService.searchCardOwners(searchText);
        setFilteredPlayers(fetchUsers.results);
      };

      searchBar.addEventListener("keyup", handleKeyUp);

      return () => {
        searchBar.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, [filteredCards, filteredPlayers, activeTab]);

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
              width: "90%",
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
                backgroundColor: "white",
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
              width: "90%",
              borderRadius: "20px",
              height: "auto",
              padding: "20px",
            }}
          >
            <h2>Search Results</h2>

          <Card style={{ maxWidth: "min(1000px, 90%)", margin: "auto", marginTop: "50px" }}>
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || "all")}
                id="card-tabs"
                className="mb-3"
                fill
              >
                <Tab
                  eventKey="all"
                  title={
                    <span>
                      All Cards
                    </span>
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start", // stick to left
                      gap: "10px",
                      padding: "10px",
                      maxHeight: "800px",
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      borderRadius: "10px",
                    }}
                  >
                    {filteredCards.length > 0 ? (
                      filteredCards.map((card) => (
                        <div
                          style={{
                            border: "1px solid black",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "10px",
                            margin: "10px",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                            width: "195px",
                            height: "300px",
                          }}
                          onClick={() => {
                            handleCardEnlarge(card);
                          }}
                        >
                          <h3>{card.name}</h3>
                          <img
                            src={card.image_url}
                            alt={card.name}
                            width="100px"
                            style={{
                              margin: "5px",
                            }}
                          />
                          <p>Hp: {card.hp ? card.hp : "N/A"}</p>
                          <p>Rarity: {card.rarity ? card.rarity : "N/A"}</p>
                        </div>
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
                </Tab>
                <Tab
                  eventKey="player"
                  title={
                    <span>
                      Player's Cards
                    </span>
                  }
                >
                  {filteredPlayers.length > 0 ? (
                    <ListGroup>
                      {filteredPlayers.map(player => (
                        <ListGroup.Item
                          key={player.username}
                          action
                          href={`/player/${player.username}`}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {player.username}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )
                : (
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
              </Tab>
              </Tabs>
            </Card.Body>
          </Card>

          
            
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
