from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from services import user_service
from db.session import get_db
from schemas.user import PublicProfileOut
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=PublicProfileOut)
async def get_user_by_id(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):

    user, profile = await user_service.get_user_info(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return PublicProfileOut(
        id=user.id,
        username=profile.username if profile else f"user_{user.id}",
        name=user.name,
        bio=profile.bio if profile else None,
        avatar_url=profile.avatar_url if profile else None,
        github_url=profile.github_url if profile else None,
        picture=user.picture
    )