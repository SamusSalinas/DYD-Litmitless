from sqlmodel import Session, select
from app.db.models.homebrew import Homebrew

def get_all(session: Session, name=None, content_type=None):
    stmt = select(Homebrew)
    if name:
        stmt = stmt.where(Homebrew.name.ilike(f"%{name}%"))
    if content_type:
        stmt = stmt.where(Homebrew.content_type == content_type)
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(Homebrew, id)

def create(session: Session, obj_in: dict):
    db_obj = Homebrew(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: Homebrew, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: Homebrew):
    session.delete(db_obj)
    session.commit()
