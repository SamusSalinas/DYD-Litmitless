import os

base_path = r"c:\Users\Samuel\Desktop\dnd-beyond-clone\backend\app\api\routes"

routes = {
    "spells.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.spell import SpellCreate, SpellUpdate, SpellRead
from app.services import spell_service

router = APIRouter()

@router.get("/", response_model=list[SpellRead])
def read_all(
    session: SessionDep,
    level: int | None = Query(None),
    school: str | None = Query(None),
    class_name: str | None = Query(None),
    name: str | None = Query(None),
    ritual: bool | None = Query(None),
    concentration: bool | None = Query(None),
):
    return spell_service.get_all(session, level=level, school=school, class_name=class_name, name=name, ritual=ritual, concentration=concentration)

@router.get("/{id}", response_model=SpellRead)
def read_by_id(session: SessionDep, id: str):
    obj = spell_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=SpellRead, status_code=201)
def create(session: SessionDep, obj_in: SpellCreate):
    return spell_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=SpellRead)
def update(session: SessionDep, id: str, obj_in: SpellUpdate):
    obj = spell_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = spell_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "characters.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.character import CharacterCreate, CharacterUpdate, CharacterRead
from app.services import character_service

router = APIRouter()

@router.get("/", response_model=list[CharacterRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
    race: str | None = Query(None),
    character_class: str | None = Query(None),
):
    return character_service.get_all(session, name=name, race=race, character_class=character_class)

@router.get("/{id}", response_model=CharacterRead)
def read_by_id(session: SessionDep, id: str):
    obj = character_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=CharacterRead, status_code=201)
def create(session: SessionDep, obj_in: CharacterCreate):
    return character_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=CharacterRead)
def update(session: SessionDep, id: str, obj_in: CharacterUpdate):
    obj = character_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = character_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "monsters.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.monster import MonsterCreate, MonsterUpdate, MonsterRead
from app.services import monster_service

router = APIRouter()

@router.get("/", response_model=list[MonsterRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
    type: str | None = Query(None),
    size: str | None = Query(None),
    challenge_rating: float | None = Query(None),
):
    return monster_service.get_all(session, name=name, type=type, size=size, challenge_rating=challenge_rating)

@router.get("/{id}", response_model=MonsterRead)
def read_by_id(session: SessionDep, id: str):
    obj = monster_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=MonsterRead, status_code=201)
def create(session: SessionDep, obj_in: MonsterCreate):
    return monster_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=MonsterRead)
def update(session: SessionDep, id: str, obj_in: MonsterUpdate):
    obj = monster_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = monster_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "equipment.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.equipment import EquipmentCreate, EquipmentUpdate, EquipmentRead
from app.services import equipment_service

router = APIRouter()

@router.get("/", response_model=list[EquipmentRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
    category: str | None = Query(None),
    subcategory: str | None = Query(None),
):
    return equipment_service.get_all(session, name=name, category=category, subcategory=subcategory)

@router.get("/{id}", response_model=EquipmentRead)
def read_by_id(session: SessionDep, id: str):
    obj = equipment_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=EquipmentRead, status_code=201)
def create(session: SessionDep, obj_in: EquipmentCreate):
    return equipment_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=EquipmentRead)
def update(session: SessionDep, id: str, obj_in: EquipmentUpdate):
    obj = equipment_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = equipment_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "homebrew.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.homebrew import HomebrewCreate, HomebrewUpdate, HomebrewRead
from app.services import homebrew_service

router = APIRouter()

@router.get("/", response_model=list[HomebrewRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
    content_type: str | None = Query(None),
):
    return homebrew_service.get_all(session, name=name, content_type=content_type)

@router.get("/{id}", response_model=HomebrewRead)
def read_by_id(session: SessionDep, id: str):
    obj = homebrew_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=HomebrewRead, status_code=201)
def create(session: SessionDep, obj_in: HomebrewCreate):
    return homebrew_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=HomebrewRead)
def update(session: SessionDep, id: str, obj_in: HomebrewUpdate):
    obj = homebrew_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = homebrew_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "races.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.race import RaceCreate, RaceUpdate, RaceRead
from app.services import race_service

router = APIRouter()

@router.get("/", response_model=list[RaceRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
):
    return race_service.get_all(session, name=name)

@router.get("/{id}", response_model=RaceRead)
def read_by_id(session: SessionDep, id: str):
    obj = race_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=RaceRead, status_code=201)
def create(session: SessionDep, obj_in: RaceCreate):
    return race_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=RaceRead)
def update(session: SessionDep, id: str, obj_in: RaceUpdate):
    obj = race_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = race_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
""",
    "classes.py": """from fastapi import APIRouter, HTTPException, Query
from app.api.dependencies import SessionDep
from app.schemas.character_class import CharacterClassCreate, CharacterClassUpdate, CharacterClassRead
from app.services import character_class_service

router = APIRouter()

@router.get("/", response_model=list[CharacterClassRead])
def read_all(
    session: SessionDep,
    name: str | None = Query(None),
):
    return character_class_service.get_all(session, name=name)

@router.get("/{id}", response_model=CharacterClassRead)
def read_by_id(session: SessionDep, id: str):
    obj = character_class_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/", response_model=CharacterClassRead, status_code=201)
def create(session: SessionDep, obj_in: CharacterClassCreate):
    return character_class_service.create(session, obj_in.model_dump())

@router.put("/{id}", response_model=CharacterClassRead)
def update(session: SessionDep, id: str, obj_in: CharacterClassUpdate):
    obj = character_class_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = character_class_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
"""
}

for name, content in routes.items():
    path = os.path.join(base_path, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Re-written {name}")
