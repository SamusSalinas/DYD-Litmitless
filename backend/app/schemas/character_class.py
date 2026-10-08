import uuid
from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, ConfigDict

class CharacterClassBase(BaseModel):
    name: str
    hit_die: str
    primary_ability: dict
    saving_throws: list[str]
    armor_proficiencies: list[str]
    weapon_proficiencies: list[str]
    skill_choices: dict
    features_by_level: dict
    spellcasting: dict | None = None
    description: str

class CharacterClassCreate(CharacterClassBase):
    pass

class CharacterClassUpdate(BaseModel):
    name: str | None = None
    hit_die: str | None = None
    primary_ability: dict | None = None
    saving_throws: list[str] | None = None
    armor_proficiencies: list[str] | None = None
    weapon_proficiencies: list[str] | None = None
    skill_choices: dict | None = None
    features_by_level: dict | None = None
    spellcasting: dict | None = None
    description: str | None = None

class CharacterClassRead(CharacterClassBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
