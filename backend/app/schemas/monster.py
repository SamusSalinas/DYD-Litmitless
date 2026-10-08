import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class MonsterBase(BaseModel):
    name: str
    size: str
    type: str
    alignment: str
    armor_class: int
    armor_type: str | None = None
    hit_points: int
    hit_dice: str
    speeds: dict
    ability_scores: dict
    saving_throws: dict | None = None
    skills: dict | None = None
    damage_resistances: list[str] | None = None
    damage_immunities: list[str] | None = None
    condition_immunities: list[str] | None = None
    senses: dict
    languages: str
    challenge_rating: float
    xp: int
    special_abilities: list[dict] | None = None
    actions: list[dict]
    legendary_actions: list[dict] | None = None
    description: str | None = None

class MonsterCreate(MonsterBase):
    pass

class MonsterUpdate(BaseModel):
    name: str | None = None
    size: str | None = None
    type: str | None = None
    alignment: str | None = None
    armor_class: int | None = None
    armor_type: str | None = None
    hit_points: int | None = None
    hit_dice: str | None = None
    speeds: dict | None = None
    ability_scores: dict | None = None
    saving_throws: dict | None = None
    skills: dict | None = None
    damage_resistances: list[str] | None = None
    damage_immunities: list[str] | None = None
    condition_immunities: list[str] | None = None
    senses: dict | None = None
    languages: str | None = None
    challenge_rating: float | None = None
    xp: int | None = None
    special_abilities: list[dict] | None = None
    actions: list[dict] | None = None
    legendary_actions: list[dict] | None = None
    description: str | None = None

class MonsterRead(MonsterBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
