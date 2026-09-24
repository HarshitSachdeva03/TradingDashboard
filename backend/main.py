from fastapi import FastAPI
from .db import engine, SQLModel

app = FastAPI()

SQLModel.metadata.create_all(engine)

@app.get("/")
async def read_root():
    return {"Hello": "World"}
