import { useState, useEffect, useRef } from "react";
import "./search.css";

const Search = () => {
    const [allCards, setAllCards] = useState<any[]>([]); 
    const [filteredCards, setFilteredCards] = useState<any[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch("http://localhost:8000/api/cards/?page=1")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched Data:", data);
                setAllCards(data.results); 
                setFilteredCards(data.results);
            })
            .catch((error) => console.error("Error fetching cards:", error));
    }, []);

    useEffect(() => {
        const searchBar = searchRef.current;
        
        if (searchBar) {
            const handleKeyUp = (e: KeyboardEvent) => {
                const searchText = (e.target as HTMLInputElement).value.toLowerCase();
                
                const filtered = allCards.filter((card) => 
                    searchText.trim() === "" || card.name.toLowerCase().startsWith(searchText.toLowerCase())
                );
                
                
                

                setFilteredCards(filtered);
            };

            searchBar.addEventListener("keyup", handleKeyUp);

            return () => {
                searchBar.removeEventListener("keyup", handleKeyUp);
            };
        }
    }, [allCards]);

    return (
        <>
            <nav  className="navbar navbar-light bg-red">
                <form className="form-inline">
                    <input
                        ref={searchRef}
                        className="form-control mr-sm-2"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                </form>
            </nav>
            <div className="card-Containers">
                {
                    filteredCards.map((card) => (
                        <img key={card.id} src={card.image_url} alt={card.name} width="300" />
                    ))
               }
            </div>
        </>
    );
};

export default Search;
