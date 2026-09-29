from sqlmodel import Field, SQLModel, create_engine
from datetime import UTC, datetime
from enum import Enum

class Trade(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    ts: datetime = Field(index=True)
    trader_id: str = Field(foreign_key="trader.id", index=True, ondelete="CASCADE")
    symbol: str = Field(index=True)
    side: Side
    quantity: int
    price: float

class Side(str, Enum):
    BUY = "BUY"
    SELL = "SELL"

class Limit(str, Enum):
    LOSS = "LOSS"
    NOTIONAL = "NOTIONAL"
    NET = "NET"

class Trader(SQLModel, table=True):
    id: str | None = Field(default=None, primary_key=True)
    name: str
    limit_type: Limit = Limit.NOTIONAL
    limit_value: float

class UploadError(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    upload_id: str
    row_num: int
    raw_row: list
    reason: str = Field(max_length=2000)
