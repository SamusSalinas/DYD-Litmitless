import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class CharacterFeature(BaseModel):
    name: str
    description: str


class CharacterBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    level: int = Field(default=1, ge=1, le=20)
    race: str
    character_class: str
    ability_scores: dict[str, int]
    hit_points: int = Field(ge=1)
    max_hit_points: int = Field(ge=1)
    armor_class: int = Field(ge=0)
    speed: int = Field(ge=0)
    proficiency_bonus: int = Field(ge=2, le=6)
    proficiencies: dict[str, list[str]]
    equipment: list[str] = Field(default_factory=list)
    features: list[CharacterFeature] = Field(default_factory=list)
    spell_ids: list[str] | None = None
    background: str | None = None
    alignment: str | None = None
    backstory: str | None = None
    is_homebrew: bool = False

class CharacterCreate(CharacterBase):
    pass


class CharacterUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    level: int | None = Field(default=None, ge=1, le=20)
    race: str | None = None
    character_class: str | None = None
    ability_scores: dict[str, int] | None = None
    hit_points: int | None = Field(default=None, ge=1)
    max_hit_points: int | None = Field(default=None, ge=1)
    armor_class: int | None = Field(default=None, ge=0)
    speed: int | None = Field(default=None, ge=0)
    proficiency_bonus: int | None = Field(default=None, ge=2, le=6)
    proficiencies: dict[str, list[str]] | None = None
    equipment: list[str] | None = None
    features: list[CharacterFeature] | None = None
    spell_ids: list[str] | None = None
    background: str | None = None
    alignment: str | None = None
    backstory: str | None = None
    is_homebrew: bool | None = None

    @model_validator(mode="after")
    def reject_null_required_fields(self) -> "CharacterUpdate":
        required_fields = {
            "name",
            "level",
            "race",
            "character_class",
            "ability_scores",
            "hit_points",
            "max_hit_points",
            "armor_class",
            "speed",
            "proficiency_bonus",
            "proficiencies",
            "equipment",
            "features",
            "is_homebrew",
        }
        for field_name in required_fields & self.model_fields_set:
            if getattr(self, field_name) is None:
                raise ValueError(f"{field_name} cannot be null")
        return self


class CharacterRead(CharacterBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
