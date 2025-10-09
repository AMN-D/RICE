from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from models.rice import Review, Rice
from models.user import User
from schemas.review import ReviewCreate, ReviewUpdate

async def create_review(
    db: AsyncSession,
    rice_id: int,
    user_id: int,
    review_data: ReviewCreate
) -> Review:
    rice = await db.get(Rice, rice_id)
    if rice.user_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot review your own rice"
        )
    
    existing_review = await db.execute(
        select(Review).where(
            and_(
                Review.rice_id == rice_id,
                Review.user_id == user_id
            )
        )
    )
    if existing_review.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this rice. Use update instead."
        )
    
    new_review = Review(
        rice_id=rice_id,
        user_id=user_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    db.add(new_review)
    await db.commit()
    await db.refresh(new_review)
    
    return new_review

async def get_review_by_id(
    db: AsyncSession,
    review_id: int
) -> Review:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.user))
        .where(Review.id == review_id)
    )
    review = result.scalar_one_or_none()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    return review

async def get_reviews_by_rice(
    db: AsyncSession,
    rice_id: int,
    skip: int = 0,
    limit: int = 20,
    sort_by: str = "recent"
) -> list[Review]:
    query = select(Review).options(
        selectinload(Review.user).selectinload(User.profiles)
    ).where(Review.rice_id == rice_id)
    
    if sort_by == "helpful":
        query = query.order_by(Review.helpful_count.desc())
    elif sort_by == "rating_high":
        query = query.order_by(Review.rating.desc())
    elif sort_by == "rating_low":
        query = query.order_by(Review.rating.asc())
    else:
        query = query.order_by(Review.date_created.desc())
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()

async def get_user_review_for_rice(
    db: AsyncSession,
    rice_id: int,
    user_id: int
) -> Review | None:
    result = await db.execute(
        select(Review).where(
            and_(
                Review.rice_id == rice_id,
                Review.user_id == user_id
            )
        )
    )
    return result.scalar_one_or_none()

async def get_reviews_by_user(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 20
) -> list[Review]:
    result = await db.execute(
        select(Review)
        .options(selectinload(Review.rice))
        .where(Review.user_id == user_id)
        .order_by(Review.date_created.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def update_review(
    db: AsyncSession,
    review_id: int,
    user_id: int,
    review_data: ReviewUpdate
) -> Review:
    review = await get_review_by_id(db, review_id)
    
    if review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this review"
        )
    
    if review_data.rating is not None:
        review.rating = review_data.rating
    if review_data.comment is not None:
        review.comment = review_data.comment
    
    await db.commit()
    await db.refresh(review)
    return review

async def mark_review_helpful(
    db: AsyncSession,
    review_id: int
) -> Review:
    review = await get_review_by_id(db, review_id)
    review.helpful_count += 1
    await db.commit()
    await db.refresh(review)
    return review

async def delete_review(
    db: AsyncSession,
    review_id: int,
    user_id: int
) -> None:
    review = await get_review_by_id(db, review_id)
    
    if review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this review"
        )
    
    await db.delete(review)
    await db.commit()

async def get_review_stats(
    db: AsyncSession,
    rice_id: int
) -> dict:
    stats = await db.execute(
        select(
            func.avg(Review.rating).label('avg_rating'),
            func.count(Review.id).label('total_reviews')
        ).where(Review.rice_id == rice_id)
    )
    result = stats.one()
    
    distribution = {}
    for rating in range(1, 6):
        count = await db.scalar(
            select(func.count(Review.id))
            .where(
                and_(
                    Review.rice_id == rice_id,
                    Review.rating == rating
                )
            )
        )
        distribution[rating] = count or 0
    
    return {
        "avg_rating": float(result.avg_rating) if result.avg_rating else None,
        "total_reviews": result.total_reviews or 0,
        "rating_distribution": distribution
    }