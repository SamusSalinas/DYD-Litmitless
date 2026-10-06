from sqlmodel import SQLModel, Field

class CharacterBase(SQLModel):
    name: str = Field(index=True)
    level: int = Field(default=1, description="Nivel del personaje")
    player_name: str | None = None

    race_id: int | None = Field(default=None, foreign_key="race.id")
    class_id: int | None = Field(default=None, foreign_key="class.id")

class Character(CharacterBase, table=True):
    id: int | None = Field(default=None, primary_key=True)

class CharacterCreate(CharacterBase):
    pass

class CharacterPublic(CharacterBase):
    id: int