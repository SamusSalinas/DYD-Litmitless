import uuid

from fastapi import APIRouter, HTTPException, status
from app.api.dependencies import SessionDep
from app.schemas.character import CharacterCreate, CharacterRead, CharacterUpdate
from app.services import character_service

router = APIRouter()


@router.get("/")
def read_all(session: SessionDep) -> list[CharacterRead]:
    return character_service.get_all(session)


@router.get("/{id}")
def read_by_id(session: SessionDep, id: uuid.UUID) -> CharacterRead:
    obj = character_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@router.post("/", response_model=CharacterRead, status_code=status.HTTP_201_CREATED)
def create(session: SessionDep, obj_in: CharacterCreate) -> CharacterRead:
    return character_service.create(session, obj_in.model_dump())


@router.put("/{id}")
def update(session: SessionDep, id: uuid.UUID, obj_in: CharacterUpdate) -> CharacterRead:
    obj = character_service.update(session, id, obj_in.model_dump(exclude_unset=True))
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj


@router.delete("/{id}")
def delete(session: SessionDep, id: uuid.UUID) -> dict[str, bool]:
    success = character_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
