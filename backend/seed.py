import random
from datetime import datetime, timedelta
from models import Trade
from sqlmodel import Session
from db import engine, create_db_and_tables

def seed(n=200):
    create_db_and_tables()
    start = datetime(2026, 9, 30, 5, 37)
    symbols = ["NIFTY","BANKNIFTY","FINNIFTY"]
    traders = ["T1","T2","T3"]

    with Session(engine) as s:
        for i in range(n):
            s.add(
                Trade(
                    ts = start + timedelta(minutes= i*2),
                    trader_id = random.choice(traders),
                    symbol = random.choice(symbols),
                    side = random.choice(["BUY", "SELL"]),
                    quantity = random.randint(1,100),
                    price = round(random.uniform(22000, 23000), 2)
                )
            )
        s.commit()

if __name__=="__main__":
    seed(200)
    print("SEEDED!")