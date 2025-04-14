import { useState, useEffect, useRef } from "react";
import "./search.css";

const Search = () => {
    const [allCards, setAllCards] = useState<any[]>([]); 
    const [filteredCards, setFilteredCards] = useState<any[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const searchBar = searchRef.current;
        
        if (searchBar) {
            const handleKeyUp = (e: KeyboardEvent) => {
                const searchText = (e.target as HTMLInputElement).value.toLowerCase();
                
                fetch(`${import.meta.env.VITE_API_URL}/search/?q=` + searchText)
                    .then((response) => response.json())
                    .then((data) => {
                        setAllCards(data.results);
                        setFilteredCards(data.results);
                    })
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
                <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
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
                        <img key={card.id} src={card.image} alt={card.name} width="300" />
                    ))
               }
            </div>
        </>
    );
};

export default Search;