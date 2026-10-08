import uuid

from sqlmodel import Session
from app.crud import crud_character


def get_all(session: Session, **kwargs):
    return crud_character.get_all(session, **kwargs)


def get_by_id(session: Session, id: uuid.UUID):
    return crud_character.get_by_id(session, id)


def create(session: Session, obj_in: dict):
    return crud_character.create(session, obj_in)


def update(session: Session, id: uuid.UUID, obj_in: dict):
    db_obj = crud_character.get_by_id(session, id)
    if db_obj:
        return crud_character.update(session, db_obj, obj_in)
    return None


def delete(session: Session, id: uuid.UUID):
    db_obj = crud_character.get_by_id(session, id)
    if db_obj:
        crud_character.delete(session, db_obj)
        return True
    return False
