import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class HomebrewBase(BaseModel):
    name: str
    content_type: str
    data: dict
    description: str | None = None

class HomebrewCreate(HomebrewBase):
    pass

class HomebrewUpdate(BaseModel):
    name: str | None = None
    content_type: str | None = None
    data: dict | None = None
    description: str | None = None

class HomebrewRead(HomebrewBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
