from fastapi import APIRouter, Depends
from schemas.user import UserCreate, UserOut 
from services.user import create_user 
from db.session import get_db

router = APIRouter()

@router.post("/users/", response_model=UserOut, status_code=201)
async def register_user(user_in: UserCreate, db=Depends(get_db)) -> UserOut:  
    user = await create_user(db, user_in)
    return user