from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import get_settings
from app.db.database import create_db_and_tables
from app.api.dependencies import SessionDep
from app.api.routes import spells, classes, races, monsters, equipment, characters, homebrew, seed, manuals


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


settings = get_settings()
app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spells.router, prefix="/api/spells", tags=["Spells"])
app.include_router(classes.router, prefix="/api/classes", tags=["Classes"])
app.include_router(races.router, prefix="/api/races", tags=["Races"])
app.include_router(monsters.router, prefix="/api/monsters", tags=["Monsters"])
app.include_router(equipment.router, prefix="/api/equipment", tags=["Equipment"])
app.include_router(characters.router, prefix="/api/characters", tags=["Characters"])
app.include_router(homebrew.router, prefix="/api/homebrew", tags=["Homebrew"])
app.include_router(seed.router, prefix="/api/seed", tags=["Seed"])
app.include_router(manuals.router, prefix="/api/manuals", tags=["Manuals"])


@app.get("/api/health")
def health_check(session: SessionDep) -> dict[str, str]:
    try:
        session.exec(text("SELECT 1"))
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return {"status": "ok"}