import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Equipment(SQLModel, table=True):
    __tablename__ = "equipment"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    category: str
    subcategory: str | None = None
    cost: str
    weight: float | None = None
    properties: dict | None = Field(default=None, sa_column=Column(JSONB))
    description: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
