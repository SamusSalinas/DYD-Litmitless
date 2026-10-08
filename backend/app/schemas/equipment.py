import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class EquipmentBase(BaseModel):
    name: str
    category: str
    subcategory: str | None = None
    cost: str
    weight: float | None = None
    properties: dict | None = None
    description: str | None = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    subcategory: str | None = None
    cost: str | None = None
    weight: float | None = None
    properties: dict | None = None
    description: str | None = None

class EquipmentRead(EquipmentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
