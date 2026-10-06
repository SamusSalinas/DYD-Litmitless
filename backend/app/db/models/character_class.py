from typing import Any
from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB

class ClassBase(SQLModel):
    name: str = Field(index=True)
    hit_die: int = Field(description="Valor del dado de golpe (ej. 12)")
    class_features: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSONB))

class Class(ClassBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class ClassCreate(ClassBase):
    pass

class ClassPublic(ClassBase):
    id: int