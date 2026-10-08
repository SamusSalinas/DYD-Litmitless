from sqlmodel import Session, select
from app.db.models.equipment import Equipment

def get_all(session: Session, name=None, category=None, subcategory=None):
    stmt = select(Equipment)
    if name:
        stmt = stmt.where(Equipment.name.ilike(f"%{name}%"))
    if category:
        stmt = stmt.where(Equipment.category == category)
    if subcategory:
        stmt = stmt.where(Equipment.subcategory == subcategory)
    return session.exec(stmt).all()

def get_by_id(session: Session, id: str):
    return session.get(Equipment, id)

def create(session: Session, obj_in: dict):
    db_obj = Equipment(**obj_in)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def update(session: Session, db_obj: Equipment, obj_in: dict):
    for key, value in obj_in.items():
        setattr(db_obj, key, value)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

def delete(session: Session, db_obj: Equipment):
    session.delete(db_obj)
    session.commit()
