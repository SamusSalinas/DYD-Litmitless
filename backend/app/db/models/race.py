import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Race(SQLModel, table=True):
    __tablename__ = "races"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    ability_bonuses: dict = Field(sa_column=Column(JSONB))
    speed: int
    size: str
    traits: list = Field(default_factory=list, sa_column=Column(JSONB))
    languages: list = Field(default_factory=list, sa_column=Column(JSONB))
    subraces: list | None = Field(default=None, sa_column=Column(JSONB))
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))