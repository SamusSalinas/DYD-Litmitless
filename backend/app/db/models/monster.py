import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Monster(SQLModel, table=True):
    __tablename__ = "monsters"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    size: str
    type: str
    alignment: str
    armor_class: int
    armor_type: str | None = None
    hit_points: int
    hit_dice: str
    speeds: dict = Field(sa_column=Column(JSONB))
    ability_scores: dict = Field(sa_column=Column(JSONB))
    saving_throws: dict | None = Field(default=None, sa_column=Column(JSONB))
    skills: dict | None = Field(default=None, sa_column=Column(JSONB))
    damage_resistances: list | None = Field(default=None, sa_column=Column(JSONB))
    damage_immunities: list | None = Field(default=None, sa_column=Column(JSONB))
    condition_immunities: list | None = Field(default=None, sa_column=Column(JSONB))
    senses: dict = Field(sa_column=Column(JSONB))
    languages: str
    challenge_rating: float
    xp: int
    special_abilities: list | None = Field(default=None, sa_column=Column(JSONB))
    actions: list = Field(default_factory=list, sa_column=Column(JSONB))
    legendary_actions: list | None = Field(default=None, sa_column=Column(JSONB))
    description: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
