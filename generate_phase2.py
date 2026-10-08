import os

domains = ["spell", "character_class", "race", "monster", "equipment", "character", "homebrew"]

domain_routers = {
    "spell": "spells",
    "character_class": "classes",
    "race": "races",
    "monster": "monsters",
    "equipment": "equipment",
    "character": "characters",
    "homebrew": "homebrew",
}

for d in domains:
    os.makedirs(f"backend/app/schemas", exist_ok=True)
    os.makedirs(f"backend/app/crud", exist_ok=True)
    os.makedirs(f"backend/app/services", exist_ok=True)
    os.makedirs(f"backend/app/api/routes", exist_ok=True)

    # Schema
    schema_code = f"""import uuid
from typing import Optional, Any
from pydantic import BaseModel

class {d.replace('_', ' ').title().replace(' ', '')}Base(BaseModel):
    name: str

class {d.replace('_', ' ').title().replace(' ', '')}Create({d.replace('_', ' ').title().replace(' ', '')}Base):
    pass

class {d.replace('_', ' ').title().replace(' ', '')}Update(BaseModel):
    name: Optional[str] = None

class {d.replace('_', ' ').title().replace(' ', '')}Read({d.replace('_', ' ').title().replace(' ', '')}Base):
    id: uuid.UUID
    
    class Config:
        from_attributes = True
"""
    with open(f"backend/app/schemas/{d}.py", "w") as f:
        f.write(schema_code)
        
    # CRUD
    crud_code = f"""from sqlmodel import Session, select
from app.db.models.{d} import {d.replace('_', ' ').title().replace(' ', '')}

def get_all(session: Session):
    return session.exec(select({d.replace('_', ' ').title().replace(' ', '')})).all()

def get_by_id(session: Session, id: str):
    return session.get({d.replace('_', ' ').title().replace(' ', '')}, id)

def create(session: Session, obj_in: dict):
    db_obj = {d.replace('_', ' ').title().replace(' ', '')}(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: {d.replace('_', ' ').title().replace(' ', '')}, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: {d.replace('_', ' ').title().replace(' ', '')}):
    session.delete(db_obj)
    session.commit()
"""
    with open(f"backend/app/crud/crud_{d}.py", "w") as f:
        f.write(crud_code)
        
    # Services
    service_code = f"""from sqlmodel import Session
from app.crud import crud_{d}

def get_all(session: Session):
    return crud_{d}.get_all(session)

def get_by_id(session: Session, id: str):
    return crud_{d}.get_by_id(session, id)

def create(session: Session, obj_in: dict):
    return crud_{d}.create(session, obj_in)

def update(session: Session, id: str, obj_in: dict):
    db_obj = crud_{d}.get_by_id(session, id)
    if db_obj:
        return crud_{d}.update(session, db_obj, obj_in)
    return None

def delete(session: Session, id: str):
    db_obj = crud_{d}.get_by_id(session, id)
    if db_obj:
        crud_{d}.delete(session, db_obj)
        return True
    return False
"""
    with open(f"backend/app/services/{d}_service.py", "w") as f:
        f.write(service_code)
        
    # Routes
    router_name = domain_routers[d]
    route_code = f"""from fastapi import APIRouter, HTTPException
from app.api.dependencies import SessionDep
from app.services import {d}_service

router = APIRouter()

@router.get("/")
def read_all(session: SessionDep):
    return {d}_service.get_all(session)

@router.get("/{{id}}")
def read_by_id(session: SessionDep, id: str):
    obj = {d}_service.get_by_id(session, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.post("/")
def create(session: SessionDep, obj_in: dict):
    return {d}_service.create(session, obj_in)

@router.put("/{{id}}")
def update(session: SessionDep, id: str, obj_in: dict):
    obj = {d}_service.update(session, id, obj_in)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

@router.delete("/{{id}}")
def delete(session: SessionDep, id: str):
    success = {d}_service.delete(session, id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {{"ok": True}}
"""
    with open(f"backend/app/api/routes/{router_name}.py", "w") as f:
        f.write(route_code)

# Seed router stub
with open(f"backend/app/api/routes/seed.py", "w") as f:
    f.write('''from fastapi import APIRouter
from app.api.dependencies import SessionDep
from app.db.seed import seed_all

router = APIRouter()

@router.post("/")
def run_seed(session: SessionDep):
    seed_all(session)
    return {"message": "Seed completed successfully"}
''')
