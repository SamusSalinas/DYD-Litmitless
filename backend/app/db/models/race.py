from typing import Any
from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

class RaceBase(SQLModel):
    name: str = Field(index=True)
    speed: int = Field(description="Velocidad base en pies")
    size: str = Field(description="Tamaño (Medium, Small)")
    traits: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))

class Race(RaceBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class RaceCreate(RaceBase):
    pass

class RacePublic(RaceBase):
    id: int