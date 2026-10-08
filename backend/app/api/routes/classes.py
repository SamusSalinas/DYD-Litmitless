from fastapi import APIRouter, HTTPException
from app.api.dependencies import SessionDep
from app.services import character_class_service

router = APIRouter()

@router.get("/")
def read_all(session: SessionDep):
    return character_class_service.get_all(session)

@router.get("/{id}")
def read_by_id(session: SessionDep, id: str):
    obj = character_class_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/")
def create(session: SessionDep, obj_in: dict):
    return character_class_service.create(session, obj_in)

@router.put("/{id}")
def update(session: SessionDep, id: str, obj_in: dict):
    obj = character_class_service.update(session, id, obj_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = character_class_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
