from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from services.jwt_service import get_current_user
from db.session import get_db
from services import user_service, jwt_service
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

@router.get("/me", response_model=ProfileOut)
async def get_my_profile(
    user_id: int = Depends(jwt_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):

    profile = await user_service.get_profile_by_user_id(db, user_id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile

@router.put("/me", response_model=ProfileOut)
async def update_my_profile(
    profile_data: ProfileBase,
    user_id: int = Depends(jwt_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):

    profile = await user_service.update_profile(
        db,
        user_id=user_id,
        username=profile_data.username,
        bio=profile_data.bio,
        github_url=profile_data.github_url,
        avatar_url=profile_data.avatar_url
    )
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile

@router.delete("/me")
async def delete_account(
    response: Response,
    user_id: int = Depends(jwt_service.get_current_user),
    db: AsyncSession = Depends(get_db)
):

    deleted = await user_service.delete_user(db, user_id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Clear the authentication cookie
    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=False,
        samesite="lax"
    )
    
    return {"message": "Account deleted successfully"}
