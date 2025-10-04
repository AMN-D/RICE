from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.jwt_service import get_current_user
from services import theme_service
from schemas.theme import ThemeCreate, ThemeUpdate, ThemeOut, ThemeOutSimple
from typing import List

router = APIRouter(prefix="/themes", tags=["themes"])

@router.post("/rice/{rice_id}", response_model=ThemeOut, status_code=status.HTTP_201_CREATED)
async def add_theme_to_rice(
    rice_id: int,
    theme_data: ThemeCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    theme = await theme_service.create_theme(
        db=db,
        rice_id=rice_id,
        theme_data=theme_data
    )
    await db.commit()
    return theme

@router.get("/{theme_id}", response_model=ThemeOut)
async def get_theme(
    theme_id: int,
    db: AsyncSession = Depends(get_db)
):
    theme = await theme_service.get_theme_by_id(db, theme_id)
    return theme

@router.get("/rice/{rice_id}", response_model=List[ThemeOut])
async def get_themes_for_rice(
    rice_id: int,
    db: AsyncSession = Depends(get_db)
):
    themes = await theme_service.get_themes_by_rice(db, rice_id)
    return themes

@router.patch("/{theme_id}", response_model=ThemeOut)
async def update_theme(
    theme_id: int,
    theme_data: ThemeUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    theme = await theme_service.update_theme(
        db=db,
        theme_id=theme_id,
        user_id=user_id,
        theme_data=theme_data
    )
    return theme

@router.delete("/{theme_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_theme(
    theme_id: int,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    await theme_service.delete_theme(
        db=db,
        theme_id=theme_id,
        user_id=user_id
    )
    return None