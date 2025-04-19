Poketrade
=========

Description
-----------

Pokemon card trading app

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
    pip install -r requirements.txt
    python manage.py makemigrations
    python manage.py migrate
    python manage.py fetch_cards
    python manage.py seed_packs
    python manage.py seed_security_questions
    python manage.py runserver
    ```

    Check that the backend server is running at <http://localhost:8000>

3. Create the frontend .env

    Receive a .env file from the repo creators. Place it in `./frontend` directory. 

4. In a separate terminal, run the frontend server

    ```bash
    cd frontend
    npm install
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
python manage.py runserver
```

Finally, check that the backend server is running at <http://localhost:8000>. 