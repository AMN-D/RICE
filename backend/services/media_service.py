from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from fastapi import HTTPException, status
from models.rice import ThemeMedia, Theme, Rice
from schemas.theme_media import ThemeMediaCreate, ThemeMediaUpdate

async def create_theme_media(
    db: AsyncSession,
    theme_id: int,
    media_data: ThemeMediaCreate
) -> ThemeMedia:
    new_media = ThemeMedia(
        theme_id=theme_id,
        url=str(media_data.url),
        media_type=media_data.media_type,
        display_order=media_data.display_order,
        thumbnail_url=str(media_data.thumbnail_url) if media_data.thumbnail_url else None
    )
    db.add(new_media)
    await db.flush()
    
    return new_media

async def get_media_by_id(
    db: AsyncSession,
    media_id: int
) -> ThemeMedia:
    media = await db.get(ThemeMedia, media_id)
    
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media not found"
        )
    
    return media

async def get_media_by_theme(
    db: AsyncSession,
    theme_id: int
) -> list[ThemeMedia]:
    result = await db.execute(
        select(ThemeMedia)
        .where(ThemeMedia.theme_id == theme_id)
        .order_by(ThemeMedia.display_order)
    )
    return result.scalars().all()

async def update_theme_media(
    db: AsyncSession,
    media_id: int,
    user_id: int,
    media_data: ThemeMediaUpdate
) -> ThemeMedia:
    media = await get_media_by_id(db, media_id)
    
    theme = await db.get(Theme, media.theme_id)
    rice = await db.get(Rice, theme.rice_id)
    
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this media"
        )
    
    if media_data.url is not None:
        media.url = str(media_data.url)
    if media_data.display_order is not None:
        media.display_order = media_data.display_order
    if media_data.thumbnail_url is not None:
        media.thumbnail_url = str(media_data.thumbnail_url)
    
    await db.commit()
    await db.refresh(media)
    return media

async def reorder_media(
    db: AsyncSession,
    theme_id: int,
    user_id: int,
    media_order: list[dict]
) -> list[ThemeMedia]:
    theme = await db.get(Theme, theme_id)
    rice = await db.get(Rice, theme.rice_id)
    
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to reorder media"
        )
    
    for item in media_order:
        media = await get_media_by_id(db, item["media_id"])
        
        if media.theme_id != theme_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Media {item['media_id']} doesn't belong to theme {theme_id}"
            )
        
        media.display_order = item["display_order"]
    
    await db.commit()
    
    return await get_media_by_theme(db, theme_id)

async def delete_theme_media(
    db: AsyncSession,
    media_id: int,
    user_id: int
) -> None:
    media = await get_media_by_id(db, media_id)
    
    theme = await db.get(Theme, media.theme_id)
    rice = await db.get(Rice, theme.rice_id)
    
    if rice.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this media"
        )
    
    media_count = await db.scalar(
        select(func.count(ThemeMedia.id))
        .where(ThemeMedia.theme_id == media.theme_id)
    )
    
    if media_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last media file. Theme must have at least one image or video."
        )
    
    await db.delete(media)
    await db.commit()