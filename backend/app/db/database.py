from sqlmodel import create_engine
import os

# Normalmente cargarías esto usando pydantic-settings
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://dnd_user:secretpassword@localhost:5432/dnd_beyond_clone")

# create_engine gestiona el pool de conexiones hacia PostgreSQL
engine = create_engine(DATABASE_URL, echo=True)