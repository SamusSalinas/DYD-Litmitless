from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import PROJECT_ROOT

router = APIRouter()

MANUALS = {
    "players-handbook": {
        "title": "Player's Handbook",
        "filename": "D&D 5e - Players Handbook.pdf",
    },
    "dungeon-masters-guide": {
        "title": "Dungeon Master's Guide",
        "filename": "Dungeon Master's Guide.pdf",
    },
    "monster-manual": {
        "title": "Monster Manual",
        "filename": "Monster Manual.pdf",
    },
}


@router.get("/")
def list_manuals() -> list[dict[str, str | bool]]:
    return [
        {
            "id": manual_id,
            "title": manual["title"],
            "available": (PROJECT_ROOT / manual["filename"]).is_file(),
            "url": f"/api/manuals/{manual_id}",
        }
        for manual_id, manual in MANUALS.items()
    ]


@router.get("/{manual_id}")
def read_manual(manual_id: str) -> FileResponse:
    manual = MANUALS.get(manual_id)
    if manual is None:
        raise HTTPException(status_code=404, detail="Manual not found")

    pdf_path = PROJECT_ROOT / manual["filename"]
    if not pdf_path.is_file():
        raise HTTPException(status_code=404, detail="Manual PDF is not available")

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=manual["filename"],
        content_disposition_type="inline",
    )
