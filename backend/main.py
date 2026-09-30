from fastapi import FastAPI, Depends, Query
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables, get_session
from sqlmodel import Session, select, func
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
def list_trades(
    symbol: str | None = None,
    trader: str | None = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    stmt = select(Trade)
    if symbol:
        stmt = stmt.where(Trade.symbol == symbol)
    if trader:
        stmt = stmt.where(Trade.trader_id == trader)

    total = session.exec(
        select(func.count()).select_from(stmt.subquery())
    ).one()

    items = session.exec(
        stmt.order_by(Trade.ts.desc())
            .offset((page - 1) * size)
            .limit(size)
    ).all()

    return {"items": items, "total": total, "page": page, "size": size}
