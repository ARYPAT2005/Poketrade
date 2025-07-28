Poketrade
=========

Description
-----------
PokéTrade is a full-stack web application built by a team of four developers as part of a collaborative software engineering project. The platform allows users to collect, manage, and trade Pokémon cards in a dynamic and interactive environment.

Our team followed Agile development methodologies, incorporating Scrum practices such as weekly sprint planning, stand-ups, and retrospectives with a real world client. This approach enabled us to iterate quickly, adapt to feedback, and maintain clear communication throughout the development cycle.

User Stories
-----------
1. As a player, I want to be able to create an account to access my data.

2. As a player, I want to login with my correct credentials and be able to access the app.

3. As a player, I want to be able to reset my password in case I forget it.

4. As a player, I want to be able to see an “about” page of the application so that I can understand the purpose and function of the application.

5. As a player, I want to be able to manage a virtual wallet of virtual currency so that I can improve my deck.

6. As a player, I want to be able to receive daily login rewards so that I can have an incentive to regularly log in to the application.

7. As a player, I want the ability to directly trade cards with other players so we can both receive cards we want without having to go through the marketplace.

8. As a player, I want to see the details of each card (rarity, name, picture of the Pokémon, etc.).

9. As a player, I want the ability to search Pokémon so I can look at a specific Pokémon’s details.

10. As a player, I want the ability to filter (rarity, price, type, etc) by Pokémon in the marketplace only so I can search for Pokémon I want that will be listed for sale/trade.

11. As a player, I want the ability to put a card on sale in the marketplace so that I can receive money for cards I don’t really want.

12. As a player, I want to be able to purchase a card off the marketplace so that I can purchase cards that I want with virtual money.

13. As a player, I want the ability to access the website from a variety of platforms and screen sizes so that I can manage my deck on the go.

14. As a player, I want the ability to receive a random starting hand and a set amount of in-game currency (PokéCoins) at account creation so I can begin with something.

15. As a player, I want to be able to purchase packs of cards so that I can add new cards to my hand without having to go through other players.

16. As a player, I want to email other players for trading negotiations.

17. As a player, I want the ability to face off in simulated battles with my cards using OpenAI’s ChatGPT API in order to feel a sense of satisfaction for creating my deck.

18. As a player, I want the ability to create new cards with the help of OpenAI’s ChatGPT API for the descriptions and OpenAI’s DALL·E API for the images so that I can insert my own ideas and creations into the game.

19. As a guest user, I want the ability to view the marketplace without having to log in to the system.

Administrator Stories
20. As a system administrator, I want to be able to update, manage, and delete users from the app to keep the web application up to date.

21. As a system administrator, I want to be able to update, manage, and delete fees associated with various transactions, such as the marketplace fee and the trading fee, in order to maximize profit for the application owner.

22. As a system administrator, I want the ability to modify the decks of existing players so that I can remove cards that were obtained through illegitimate means, such as taking advantage of system bugs.

23. As a system administrator, I want the ability to add new cards to the game, receiving their information from PokéAPI, so that new cards created by Nintendo are also tracked in the game.

24. As a system administrator, I want to be able to update details of existing cards, such as their picture and description, in case Nintendo decides to update the details of existing cards.

25. As a system administrator, I want to be able to modify the “drop rate” of various cards in packs so that their rarity in-game corresponds to their rarity in real life.

26. As a system administrator, I want to be able to host the website on a reliable server so that users can access it seamlessly without downtime.
Authors
-------

**Jerry Wang** (GTID: 903883389)\
**Joshua Joseph** (GTID: 903962022)\
**Aryan Patel** (GTID: 903973313)\
**Kush Sharma** (GTID: 903665187)

Setup
-----

1. Clone the repository:

    ```bash
    git clone https://github.com/05jwang/Poketrade.git
    ```

2. Run the backend server

    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py fetch_cards
    python manage.py seed_packs
    python manage.py seed_security_questions
    python manage.py seed_fees
    python manage.py runserver
    ```

    Check that the backend server is running at <http://localhost:8000>

3. Create the frontend .env

    Receive a .env file from the repo creators. Place it in `./frontend` directory. 

4. In a separate terminal, run the frontend server

    ```bash
    cd frontend
    npm install
    npm audit fix
    npm fund
    npm run dev
    ```

5. Open a browser and go to <http://localhost:5173>

Update
------

To update after a significant change in the backend, run the following commands in the backend directory:

```bash
cd backend
source venv/bin/activate
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
rm db.sqlite3
pip uninstall django
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py fetch_cards
python manage.py seed_packs
python manage.py seed_security_questions
    python manage.py seed_fees
python manage.py runserver
```

Finally, check that the backend server is running at <http://localhost:8000>. 
