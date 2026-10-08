from sqlmodel import Session, select
from app.db.models.spell import Spell

def get_all(session: Session, level=None, school=None, class_name=None, name=None, ritual=None, concentration=None):
    stmt = select(Spell)
    if level is not None:
        stmt = stmt.where(Spell.level == level)
    if school:
        stmt = stmt.where(Spell.school == school)
    if name:
        stmt = stmt.where(Spell.name.ilike(f"%{name}%"))
    if ritual is not None:
        stmt = stmt.where(Spell.ritual == ritual)
    if concentration is not None:
        stmt = stmt.where(Spell.concentration == concentration)
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(Spell, id)

def create(session: Session, obj_in: dict):
    db_obj = Spell(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: Spell, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: Spell):
    session.delete(db_obj)
    session.commit()
