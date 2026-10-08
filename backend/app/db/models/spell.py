import uuid
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB

class Spell(SQLModel, table=True):
    __tablename__ = "spells"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True, unique=True)
    level: int
    school: str
    casting_time: str
    range: str
    components: str
    material: str | None = None
    duration: str
    description: str
    higher_levels: dict | None = Field(default=None, sa_column=Column(JSONB))
    classes: list = Field(default_factory=list, sa_column=Column(JSONB))
    ritual: bool = Field(default=False)
    concentration: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
