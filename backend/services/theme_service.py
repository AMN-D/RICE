from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from models.rice import Theme, ThemeMedia, Rice
from schemas.theme import ThemeCreate, ThemeUpdate
from services import media_service
 
async def create_theme(
    db: AsyncSession,
    rice_id: int,
    theme_data: ThemeCreate
) -> Theme:
    new_theme = Theme(
        rice_id=rice_id,
        name=theme_data.name,
        description=theme_data.description,
        tags=theme_data.tags,
        display_order=theme_data.display_order
    )
    db.add(new_theme)
    await db.flush()

    for media_data in theme_data.media:
        await media_service.create_theme_media(
            db=db,
            theme_id=new_theme.id,
            media_data=media_data
        )

    query = (
        select(Theme)
        .where(Theme.id == new_theme.id)
        .options(selectinload(Theme.media)) 
    )
    result = await db.execute(query)
    created_theme = result.scalars().one()

    return new_theme

async def get_theme_by_id(
    db: AsyncSession,
    theme_id: int,
) -> Theme:
    result = await db.execute(
        select(Theme)
        .options(selectinload(Theme.media))
        .where(Theme.id == theme_id)
    )
    theme = result.scalar_one_or_none()

    if not theme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Theme not found" 
        )
    
    return theme

async def get_themes_by_rice(
    db: AsyncSession,
    rice_id: int
) -> list[Theme]:
    result = await db.execute(
        select(Theme)
        .options(selectinload(Theme.media))
        .where(Theme.rice_id == rice_id)
        .order_by(Theme.display_order)
    )
    return result.scalars().all()

async def update_theme(
    db: AsyncSession,
    theme_id: int,
    user_id: int,
    theme_data: ThemeUpdate
) -> Theme:
    theme = await get_theme_by_id(db, theme_id)
    rice = await db.get(Rice, theme.rice_id)
    
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this theme"
        )

    if theme_data.name is not None:
        theme.name = theme_data.name
    if theme_data.description is not None:
        theme.description = theme_data.description
    if theme_data.tags is not None:
        theme.tags = theme_data.tags
    if theme_data.display_order is not None:
        theme.display_order = theme_data.display_order
    
    await db.commit()
    await db.refresh(theme)
    return theme

async def delete_theme(
    db: AsyncSession,
    theme_id: int,
    user_id: int
) -> None:
    theme = await get_theme_by_id(db, theme_id)
    
    rice = await db.get(Rice, theme.rice_id)
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this theme"
        )
    
    theme_count = await db.scalar(
        select(func.count(Theme.id)).where(Theme.rice_id == theme.rice_id)
    )
    
    if theme_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last theme. A rice must have at least one theme."
        )
    
    await db.delete(theme)
    await db.commit()