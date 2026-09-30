from sqlmodel import Field, SQLModel
from pydantic import NaiveDatetime

class Trade(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    ts: NaiveDatetime = Field(index=True)
    trader_id: str = Field(index=True)
    symbol: str = Field(index=True)
    side: str
    quantity: int
    price: float
