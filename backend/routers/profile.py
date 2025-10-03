from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from services.jwt_service import get_current_user
from db.session import get_db
from services import user_service
from schemas.user import ProfileBase, ProfileOut

router = APIRouter(prefix="/profile", tags=["profile"])

@router.post("/complete", response_model=ProfileOut, status_code=status.HTTP_201_CREATED)
async def complete_profile(
    profile_data: ProfileBase,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
    ):
    existing_profile = await user_service.get_profile_by_user_id(db, user_id)
    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Profile already exists"
        )
    
    new_profile = await user_service.create_profile(
        db,
        user_id=user_id,
        username=profile_data.username,
        bio=profile_data.bio,
        github_url=profile_data.github_url,
        avatar_url=profile_data.avatar_url
    )
    return new_profile