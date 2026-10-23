from fastapi import APIRouter, HTTPException
from app.api.dependencies import SessionDep
from app.services import spell_service

router = APIRouter()

@router.get("/")
def read_all(session: SessionDep, name: str | None = None, level: int | None = None, school: str | None = None):
    """Return spells filtered by optional query parameters.
    Supports partial name matching, exact level, and school filters.
    """
    return spell_service.get_all(session, name=name, level=level, school=school)

@router.get("/{id}")
def read_by_id(session: SessionDep, id: str):
    obj = spell_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/")
def create(session: SessionDep, obj_in: dict):
    return spell_service.create(session, obj_in)

@router.put("/{id}")
def update(session: SessionDep, id: str, obj_in: dict):
    obj = spell_service.update(session, id, obj_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{id}")
def delete(session: SessionDep, id: str):
    success = spell_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}
