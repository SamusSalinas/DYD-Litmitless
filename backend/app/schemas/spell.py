import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class SpellBase(BaseModel):
    name: str
    level: int
    school: str
    casting_time: str
    range: str
    components: str
    material: str | None = None
    duration: str
    description: str
    higher_levels: dict | None = None
    classes: list[str] = []
    ritual: bool = False
    concentration: bool = False

class SpellCreate(SpellBase):
    pass

class SpellUpdate(BaseModel):
    name: str | None = None
    level: int | None = None
    school: str | None = None
    casting_time: str | None = None
    range: str | None = None
    components: str | None = None
    material: str | None = None
    duration: str | None = None
    description: str | None = None
    higher_levels: dict | None = None
    classes: list[str] | None = None
    ritual: bool | None = None
    concentration: bool | None = None

class SpellRead(SpellBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
