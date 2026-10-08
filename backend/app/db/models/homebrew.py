import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Homebrew(SQLModel, table=True):
    __tablename__ = "homebrews"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str
    content_type: str
    data: dict = Field(sa_column=Column(JSONB))
    description: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
