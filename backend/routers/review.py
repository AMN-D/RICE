from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.jwt_service import get_current_user
from services import review_service
from schemas.review import ReviewCreate, ReviewUpdate, ReviewOut
from typing import List

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/rice/{rice_id}", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(
    rice_id: int,
    review_data: ReviewCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    review = await review_service.create_review(
        db=db,
        rice_id=rice_id,
        user_id=user_id,
        review_data=review_data
    )
    return review

@router.get("/{review_id}", response_model=ReviewOut)
async def get_review(
    review_id: int,
    db: AsyncSession = Depends(get_db)
):
    review = await review_service.get_review_by_id(db, review_id)
    return review

@router.get("/rice/{rice_id}", response_model=List[ReviewOut])
async def get_rice_reviews(
    rice_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("recent", regex="^(recent|helpful|rating_high|rating_low)$"),
    db: AsyncSession = Depends(get_db)
):
    reviews = await review_service.get_reviews_by_rice(
        db=db,
        rice_id=rice_id,
        skip=skip,
        limit=limit,
        sort_by=sort_by
    )
    return reviews

@router.get("/rice/{rice_id}/me", response_model=ReviewOut)
async def get_my_review_for_rice(
    rice_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    review = await review_service.get_user_review_for_rice(
        db=db,
        rice_id=rice_id,
        user_id=user_id
    )
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You haven't reviewed this rice yet"
        )
    
    return review

@router.get("/user/me", response_model=List[ReviewOut])
async def get_my_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    reviews = await review_service.get_reviews_by_user(
        db=db,
        user_id=user_id,
        skip=skip,
        limit=limit
    )
    return reviews

@router.get("/rice/{rice_id}/stats")
async def get_review_stats(
    rice_id: int,
    db: AsyncSession = Depends(get_db)
):
    stats = await review_service.get_review_stats(db, rice_id)
    return stats

@router.patch("/{review_id}", response_model=ReviewOut)
async def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    review = await review_service.update_review(
        db=db,
        review_id=review_id,
        user_id=user_id,
        review_data=review_data
    )
    return review

@router.post("/{review_id}/helpful", response_model=ReviewOut)
async def mark_review_helpful(
    review_id: int,
    db: AsyncSession = Depends(get_db)
):
    review = await review_service.mark_review_helpful(db, review_id)
    return review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    await review_service.delete_review(
        db=db,
        review_id=review_id,
        user_id=user_id
    )
    return None