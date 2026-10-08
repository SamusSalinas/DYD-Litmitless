from fastapi import APIRouter
from app.api.dependencies import SessionDep
from app.db.seed import seed_all

router = APIRouter()

@router.post("/")
def run_seed(session: SessionDep):
    seed_all(session)
    return {"message": "Seed completed successfully"}
