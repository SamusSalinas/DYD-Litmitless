import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Character(SQLModel, table=True):
    __tablename__ = "characters"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    level: int = Field(default=1)
    race: str
    character_class: str
    ability_scores: dict = Field(sa_column=Column(JSONB))
    hit_points: int
    max_hit_points: int
    armor_class: int
    speed: int
    proficiency_bonus: int
    proficiencies: dict = Field(sa_column=Column(JSONB))
    equipment: list = Field(default_factory=list, sa_column=Column(JSONB))
    features: list = Field(default_factory=list, sa_column=Column(JSONB))
    spell_ids: list | None = Field(default=None, sa_column=Column(JSONB))
    background: str | None = None
    alignment: str | None = None
    backstory: str | None = None
    is_homebrew: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))