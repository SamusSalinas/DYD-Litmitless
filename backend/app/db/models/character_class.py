import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class CharacterClass(SQLModel, table=True):
    __tablename__ = "character_classes"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    hit_die: str
    primary_ability: dict = Field(sa_column=Column(JSONB))
    saving_throws: list = Field(sa_column=Column(JSONB))
    armor_proficiencies: list = Field(default_factory=list, sa_column=Column(JSONB))
    weapon_proficiencies: list = Field(default_factory=list, sa_column=Column(JSONB))
    skill_choices: dict = Field(sa_column=Column(JSONB))
    features_by_level: dict = Field(sa_column=Column(JSONB))
    spellcasting: dict | None = Field(default=None, sa_column=Column(JSONB))
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))