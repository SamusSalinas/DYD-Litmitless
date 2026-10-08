import os
from pathlib import Path
from unittest.mock import patch

import pytest
from dotenv import dotenv_values
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.engine import make_url
from sqlalchemy.ext.compiler import compiles

from app.schemas.character import CharacterCreate, CharacterUpdate


@compiles(JSONB, "sqlite")
def compile_jsonb_for_sqlite(type_, compiler, **kwargs):
    return "JSON"


@pytest.fixture(scope="module")
def api_client():
    repository_root = Path(__file__).resolve().parents[2]
    local_environment = dotenv_values(repository_root / ".env")
    database_url = os.environ.get("TEST_DATABASE_URL") or local_environment.get(
        "TEST_DATABASE_URL"
    )
    if not database_url:
        pytest.skip("Set TEST_DATABASE_URL in the repository .env to run API tests")

    database_name = make_url(database_url).database
    if not database_name or Path(database_name).stem.endswith("_test") is False:
        pytest.fail("TEST_DATABASE_URL must point to a database whose name ends with _test")

    os.environ["DATABASE_URL"] = database_url

    from fastapi.testclient import TestClient
    from sqlmodel import Session, SQLModel, create_engine

    from app.api.dependencies import get_session
    from app.main import app

    engine = create_engine(database_url, pool_pre_ping=True)
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

    def override_session():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_session
    try:
        with patch(
            "app.main.create_db_and_tables",
            lambda: SQLModel.metadata.create_all(engine),
        ):
            with TestClient(app) as client:
                yield client
    finally:
        app.dependency_overrides.pop(get_session, None)
        SQLModel.metadata.drop_all(engine)
        engine.dispose()


def test_character_create_schema_accepts_builder_payload():
    character = CharacterCreate(
        name="Schema Hero",
        race="Human",
        character_class="Fighter",
        ability_scores={"STR": 15},
        hit_points=10,
        max_hit_points=10,
        armor_class=12,
        speed=30,
        proficiency_bonus=2,
        proficiencies={"skills": ["Athletics"], "tools": [], "languages": ["Common"]},
        equipment=["Longsword"],
        features=[{"name": "Second Wind", "description": "Recover hit points."}],
    )

    assert character.level == 1
    assert character.features[0].name == "Second Wind"


def test_character_update_rejects_null_for_required_fields():
    with pytest.raises(ValueError, match="name cannot be null"):
        CharacterUpdate(name=None)


def test_health_reports_database_available(api_client):
    response = api_client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_local_frontend_origins_are_allowed(api_client):
    response = api_client.options(
        "/api/spells/",
        headers={
            "Origin": "http://127.0.0.1:5173",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"


def test_manual_list_only_includes_known_local_pdf_files(api_client):
    response = api_client.get("/api/manuals/")

    assert response.status_code == 200
    manuals = response.json()
    assert {manual["id"] for manual in manuals} == {
        "players-handbook",
        "dungeon-masters-guide",
        "monster-manual",
    }
    assert all(manual["available"] for manual in manuals)
    assert all(manual["url"].startswith("/api/manuals/") for manual in manuals)


def test_manual_endpoint_serves_known_pdf_and_rejects_unknown_ids(api_client):
    response = api_client.get(
        "/api/manuals/monster-manual",
        headers={"Range": "bytes=0-4"},
    )

    assert response.status_code == 206
    assert response.headers["content-type"] == "application/pdf"
    assert response.content.startswith(b"%PDF-")
    assert api_client.get("/api/manuals/../../.env").status_code == 404


def test_seed_populates_all_compendium_sections_idempotently(api_client):
    first_seed = api_client.post("/api/seed/")
    second_seed = api_client.post("/api/seed/")

    assert first_seed.status_code == 200
    assert second_seed.status_code == 200
    assert len(api_client.get("/api/spells/").json()) == 3
    assert len(api_client.get("/api/classes/").json()) == 2
    assert len(api_client.get("/api/races/").json()) == 2
    assert len(api_client.get("/api/monsters/").json()) == 2
    assert len(api_client.get("/api/equipment/").json()) == 2


def test_character_crud_and_validation(api_client):
    character_data = {
        "name": "Test Hero",
        "level": 1,
        "race": "Human",
        "character_class": "Fighter",
        "ability_scores": {"STR": 15, "DEX": 14, "CON": 13, "INT": 12, "WIS": 10, "CHA": 8},
        "hit_points": 10,
        "max_hit_points": 10,
        "armor_class": 12,
        "speed": 30,
        "proficiency_bonus": 2,
        "proficiencies": {"skills": ["Athletics"], "tools": [], "languages": ["Common"]},
        "equipment": ["Longsword"],
        "features": [{"name": "Second Wind", "description": "Recover hit points."}],
        "spell_ids": None,
        "background": "Soldier",
        "alignment": None,
        "backstory": None,
        "is_homebrew": False,
    }

    invalid_response = api_client.post(
        "/api/characters/", json={**character_data, "level": 21}
    )
    assert invalid_response.status_code == 422

    create_response = api_client.post("/api/characters/", json=character_data)
    assert create_response.status_code == 201
    created = create_response.json()
    character_id = created["id"]

    assert api_client.get(f"/api/characters/{character_id}").json()["name"] == "Test Hero"
    assert len(api_client.get("/api/characters/").json()) == 1

    update_response = api_client.put(
        f"/api/characters/{character_id}",
        json={"level": 2, "backstory": "A short history."},
    )
    assert update_response.status_code == 200
    assert update_response.json()["level"] == 2
    assert update_response.json()["backstory"] == "A short history."

    delete_response = api_client.delete(f"/api/characters/{character_id}")
    assert delete_response.status_code == 200
    assert api_client.get(f"/api/characters/{character_id}").status_code == 404
