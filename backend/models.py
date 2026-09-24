from sqlmodel import Field, SQLModel, create_engine
from datetime import UTC, datetime

class Trades(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    ts: datetime = Field(default_factory=lambda: datetime.now(UTC))
    trader_id: int = Field(foreign_key="traders.id", ondelete="CASCADE")
    symbol: str
    side: str
    quantity: int
    price: float