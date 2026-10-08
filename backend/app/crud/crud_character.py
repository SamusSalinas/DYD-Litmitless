import uuid
from datetime import datetime, timezone

from sqlmodel import Session, select
from app.db.models.character import Character


def get_all(session: Session, name=None, race=None, character_class=None):
    stmt = select(Character)
    if name:
        stmt = stmt.where(Character.name.ilike(f"%{name}%"))
    if race:
        stmt = stmt.where(Character.race == race)
    if character_class:
        stmt = stmt.where(Character.character_class == character_class)
    return session.exec(stmt).all()


def get_by_id(session: Session, id: uuid.UUID) -> Character | None:
    return session.get(Character, id)


def create(session: Session, obj_in: dict):
    db_obj = Character(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update(session: Session, db_obj: Character, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    db_obj.updated_at = datetime.now(timezone.utc)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def delete(session: Session, db_obj: Character):
    session.delete(db_obj)
    session.commit()
