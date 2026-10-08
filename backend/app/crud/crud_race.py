from sqlmodel import Session, select
from app.db.models.race import Race

def get_all(session: Session, name=None):
    stmt = select(Race)
    if name:
        stmt = stmt.where(Race.name.ilike(f"%{name}%"))
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(Race, id)

def create(session: Session, obj_in: dict):
    db_obj = Race(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: Race, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: Race):
    session.delete(db_obj)
    session.commit()
