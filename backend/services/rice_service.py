from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from models.rice import Rice, Theme, Review, ThemeMedia
from schemas.rice import RiceCreate, RiceUpdate 
from services import theme_service
from typing import Optional

async def create_rice(
    db: AsyncSession,
    user_id: int,
    rice_data: RiceCreate
) -> Rice:
    new_rice = Rice(
        user_id=user_id,
        name=rice_data.name,
        dotfile_url=str(rice_data.dotfile_url),
    )
    db.add(new_rice)
    await db.flush()  

    for theme_data in rice_data.themes:
        await theme_service.create_theme(
            db=db,
            rice_id=new_rice.id,
            theme_data=theme_data
        )
    
    await db.commit()
    await db.refresh(new_rice)

    result = await db.execute(
        select(Rice)
        .options(
            selectinload(Rice.themes).selectinload(Theme.media)
        )
        .where(Rice.id == new_rice.id)
    )
    return result.scalar_one()

async def get_rice_by_id(
    db: AsyncSession,
    rice_id: int,
    include_deleted: bool = False
) -> Rice:
    query = select(Rice).options(
        selectinload(Rice.themes).selectinload(Theme.media)
    ).where(Rice.id == rice_id)

    if not include_deleted:
        query = query.where(Rice.is_deleted == False)

    result = await db.execute(query)
    rice = result.scalar_one_or_none()

    if not rice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rice not found"
        )

    await db.refresh(rice)
    return rice

async def get_rice_by_user(
    db: AsyncSession,
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    include_deleted: bool = False
) -> tuple[list[Rice], int]:
    base_query = select(Rice).where(Rice.user_id == user_id)
    if not include_deleted:
        base_query = base_query.where(Rice.is_deleted == False)

    # Count total
    total_count = await db.scalar(select(func.count()).select_from(base_query.subquery()))

    query = select(Rice).options(
        selectinload(Rice.themes).selectinload(Theme.media),
        selectinload(Rice.reviews)
    ).where(Rice.user_id == user_id)

    if not include_deleted:
        query = query.where(Rice.is_deleted == False)

    query = query.offset(skip).limit(limit).order_by(Rice.date_added.desc())
    result = await db.execute(query)
    items = result.scalars().all()
    
    return items, total_count or 0

async def get_all_rice(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 20,
    sort_by: str = "recent",
    sort_order: str = "desc"
) -> tuple[list[Rice], int]:
    base_query = select(Rice).where(Rice.is_deleted == False)
    
    # Count total
    total_count = await db.scalar(select(func.count()).select_from(base_query.subquery()))

    query = select(Rice).options(
        selectinload(Rice.themes).selectinload(Theme.media),
        selectinload(Rice.reviews)
    ).where(Rice.is_deleted == False)

    is_asc = sort_order == "asc"

    if sort_by == "popular":
        query = query.order_by(Rice.views.asc() if is_asc else Rice.views.desc())
    elif sort_by == "top_rated":
        avg_rating_col = func.avg(Review.rating)
        order_clause = avg_rating_col.asc() if is_asc else avg_rating_col.desc()
        query = query.outerjoin(Review).group_by(Rice.id).order_by(order_clause.nullslast(), Rice.date_added.desc())
    elif sort_by == "recent":
        query = query.order_by(Rice.date_added.asc() if is_asc else Rice.date_added.desc())
    else:
        query = query.order_by(Rice.date_added.asc() if is_asc else Rice.date_added.desc())

    query = query.offset(skip).limit(limit)

    result = await db.execute(query)
    items = result.scalars().all()
    return items, total_count or 0

async def search_rices(
    db: AsyncSession,
    search_query: str,
    skip: int = 0,
    limit: int = 20
) -> tuple[list[Rice], int]:
    search_pattern = f"%{search_query}%"

    base_query = select(Rice).join(Theme).where(
        and_(
            Rice.is_deleted == False,
            (
                Rice.name.ilike(search_pattern) |
                Theme.tags.ilike(search_pattern)
            )
        )
    ).distinct()

    # Count total
    total_count = await db.scalar(select(func.count()).select_from(base_query.subquery()))

    query = select(Rice).options(
        selectinload(Rice.themes).selectinload(Theme.media),
        selectinload(Rice.reviews)
    ).join(Theme).where(
        and_(
            Rice.is_deleted == False,
            (
                Rice.name.ilike(search_pattern) |
                Theme.tags.ilike(search_pattern)
            )
        )
    ).distinct()

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all()
    return items, total_count or 0

async def update_rice(
    db: AsyncSession,
    rice_id: int,
    user_id: int,
    rice_data: RiceUpdate
) -> Rice:
    rice = await get_rice_by_id(db, rice_id)
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this rice"
        )

    if rice_data.name is not None:
        rice.name = rice_data.name
    if rice_data.dotfile_url is not None:
        rice.dotfile_url = str(rice_data.dotfile_url)

    await db.commit()
    await db.refresh(rice)
    return rice

async def delete_rice(
    db: AsyncSession,
    rice_id: int,
    user_id: int,
    soft_delete: bool = True
) -> None:
    rice = await get_rice_by_id(db, rice_id)

    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this rice"
        )
    
    if soft_delete:
        rice.is_deleted = True
        await db.commit()
    else:
        await db.delete(rice)
        await db.commit()

async def increment_rice_views(
    db: AsyncSession,
    rice_id: int
) -> None:
    rice = await get_rice_by_id(db, rice_id)
    rice.views += 1
    await db.commit()

async def increment_dotfile_clicks(
    db: AsyncSession,
    rice_id: int
) -> None:
    rice = await get_rice_by_id(db, rice_id)
    rice.dotfile_clicks += 1
    await db.commit()

async def get_rice_stats(
    db: AsyncSession,
    rice_id: int
) -> dict:
    rice = await get_rice_by_id(db, rice_id)

    theme_count = await db.scalar(
        select(func.count(Theme.id)).where(Theme.rice_id == rice_id)
    )

    review_stats = await db.execute(
        select(
            func.avg(Review.rating).label("avg_rating"),
            func.count(Review.id).label("review_count")
        ).where(Review.rice_id == rice_id)
    )
    stats = review_stats.one()

    return {
        "views": rice.views,
        "dotfile_clicks": rice.dotfile_clicks,
        "theme_count": theme_count or 0,
        "avg_rating": float(stats.avg_rating) if stats.avg_rating else None,
        "review_count": stats.review_count or 0
    }