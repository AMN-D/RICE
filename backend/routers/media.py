from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.jwt_service import get_current_user
from services import media_service
from schemas.theme_media import ThemeMediaCreate, ThemeMediaUpdate, ThemeMediaOut
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/media", tags=["media"])

@router.post("/theme/{theme_id}", response_model=ThemeMediaOut, status_code=status.HTTP_201_CREATED)
async def add_media_to_theme(
    theme_id: int,
    media_data: ThemeMediaCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    media = await media_service.create_theme_media(
        db=db,
        theme_id=theme_id,
        media_data=media_data
    )
    await db.commit()
    return media

@router.get("/{media_id}", response_model=ThemeMediaOut)
async def get_media(
    media_id: int,
    db: AsyncSession = Depends(get_db)
):
    media = await media_service.get_media_by_id(db, media_id)
    return media

@router.get("/theme/{theme_id}", response_model=List[ThemeMediaOut])
async def get_theme_media(
    theme_id: int,
    db: AsyncSession = Depends(get_db)
):
    media_list = await media_service.get_media_by_theme(db, theme_id)
    return media_list

@router.patch("/{media_id}", response_model=ThemeMediaOut)
async def update_media(
    media_id: int,
    media_data: ThemeMediaUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    media = await media_service.update_theme_media(
        db=db,
        media_id=media_id,
        user_id=user_id,
        media_data=media_data
    )
    return media

class MediaOrderItem(BaseModel):
    media_id: int
    display_order: int

class MediaReorderRequest(BaseModel):
    media_order: List[MediaOrderItem]

@router.post("/theme/{theme_id}/reorder", response_model=List[ThemeMediaOut])
async def reorder_theme_media(
    theme_id: int,
    reorder_data: MediaReorderRequest,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    media_order = [item.dict() for item in reorder_data.media_order]
    
    updated_media = await media_service.reorder_media(
        db=db,
        theme_id=theme_id,
        user_id=user_id,
        media_order=media_order
    )
    return updated_media

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    await media_service.delete_theme_media(
        db=db,
        media_id=media_id,
        user_id=user_id
    )
    return None