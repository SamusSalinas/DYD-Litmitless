from sqlmodel import Session, select
from app.db.models.character_class import CharacterClass

def get_all(session: Session, name=None):
    stmt = select(CharacterClass)
    if name:
        stmt = stmt.where(CharacterClass.name.ilike(f"%{name}%"))
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(CharacterClass, id)

def create(session: Session, obj_in: dict):
    db_obj = CharacterClass(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: CharacterClass, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: CharacterClass):
    session.delete(db_obj)
    session.commit()
