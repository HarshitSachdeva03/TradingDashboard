from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables, get_session
from sqlmodel import Session, select
from models import Trade

@asynccontextmanager
async def lifespan(app:FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
def ping():
    import time    
    time.sleep(1)
    return {"message": f"pong"}

@app.get("/trades")
def list_trades(session: Session = Depends(get_session)):    
    return session.exec(select(Trade).order_by(Trade.ts.desc()).limit(50)).all()    
