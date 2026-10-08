from sqlmodel import Session, select
from app.db.models.monster import Monster

def get_all(session: Session, name=None, type=None, size=None, challenge_rating=None):
    stmt = select(Monster)
    if name:
        stmt = stmt.where(Monster.name.ilike(f"%{name}%"))
    if type:
        stmt = stmt.where(Monster.type == type)
    if size:
        stmt = stmt.where(Monster.size == size)
    if challenge_rating is not None:
        stmt = stmt.where(Monster.challenge_rating == challenge_rating)
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(Monster, id)

def create(session: Session, obj_in: dict):
    db_obj = Monster(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: Monster, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: Monster):
    session.delete(db_obj)
    session.commit()
