from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from db.database import engine

# Función que entrega una sesión única por cada petición HTTP usando yield
def get_session():
    with Session(engine) as session:
        yield session

# Tipo anotado para simplificar la inyección en las rutas
SessionDep = Annotated[Session, Depends(get_session)]