from sqlmodel import Session
from app.crud import crud_homebrew

def get_all(session: Session, **kwargs):
    return crud_homebrew.get_all(session, **kwargs)

def get_by_id(session: Session, id: str):
    return crud_homebrew.get_by_id(session, id)

def create(session: Session, obj_in: dict):
    return crud_homebrew.create(session, obj_in)

def update(session: Session, id: str, obj_in: dict):
    db_obj = crud_homebrew.get_by_id(session, id)
    if db_obj:
        return crud_homebrew.update(session, db_obj, obj_in)
    return None

def delete(session: Session, id: str):
    db_obj = crud_homebrew.get_by_id(session, id)
    if db_obj:
        crud_homebrew.delete(session, db_obj)
        return True
    return False
