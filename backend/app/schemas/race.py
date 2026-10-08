import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class RaceBase(BaseModel):
    name: str
    ability_bonuses: dict
    speed: int
    size: str
    traits: list[dict]
    languages: list[str]
    subraces: list[dict] | None = None
    description: str

class RaceCreate(RaceBase):
    pass

class RaceUpdate(BaseModel):
    name: str | None = None
    ability_bonuses: dict | None = None
    speed: int | None = None
    size: str | None = None
    traits: list[dict] | None = None
    languages: list[str] | None = None
    subraces: list[dict] | None = None
    description: str | None = None

class RaceRead(RaceBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
