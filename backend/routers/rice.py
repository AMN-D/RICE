from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from services.jwt_service import get_current_user
from services import rice_service
from schemas.rice import (
    RiceCreate,
    RiceUpdate, 
    RiceOut, 
    RiceOutSimple,
    RiceOutWithThemes,
    RicePaginationOut
)
from typing import List, Dict, Any
import math

router = APIRouter(prefix="/rices", tags=["rices"])

@router.post("/", response_model=RiceOut, status_code=status.HTTP_201_CREATED)
async def create_rice(
    rice_data: RiceCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    rice = await rice_service.create_rice(
        db=db,
        user_id=user_id,
        rice_data=rice_data
    )
    return rice

@router.get("/{rice_id}", response_model=RiceOut)
async def get_rice(
    rice_id: int,
    db: AsyncSession = Depends(get_db)
):
    rice = await rice_service.get_rice_by_id(db, rice_id)
    await rice_service.increment_rice_views(db, rice_id)
    return rice

@router.get("/", response_model=RicePaginationOut)
async def get_all_rices(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("popular", regex="^(recent|popular|top_rated)$", description="Sort by"),
    sort_order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    db: AsyncSession = Depends(get_db)
):
    rices, total = await rice_service.get_all_rice(
        db=db,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return RicePaginationOut(
        items=rices,
        total=total,
        page=(skip // limit) + 1,
        limit=limit,
        total_pages=math.ceil(total / limit) if total > 0 else 0
    )

@router.get("/user/{user_id}", response_model=RicePaginationOut)
async def get_user_rices(
    user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    rices, total = await rice_service.get_rice_by_user(
        db=db,
        user_id=user_id,
        skip=skip,
        limit=limit
    )
    return RicePaginationOut(
        items=rices,
        total=total,
        page=(skip // limit) + 1,
        limit=limit,
        total_pages=math.ceil(total / limit) if total > 0 else 1
    )

@router.get("/user/me/rices", response_model=RicePaginationOut)
async def get_my_rices(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    include_deleted: bool = Query(False, description="Include soft-deleted rices"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    rices, total = await rice_service.get_rice_by_user(
        db=db,
        user_id=user_id,
        skip=skip,
        limit=limit,
        include_deleted=include_deleted
    )
    return RicePaginationOut(
        items=rices,
        total=total,
        page=(skip // limit) + 1,
        limit=limit,
        total_pages=math.ceil(total / limit) if total > 0 else 0
    )

@router.get("/search/", response_model=RicePaginationOut)
async def search_rices(
    q: str = Query(..., min_length=1, description="Search query"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    rices, total = await rice_service.search_rices(
        db=db,
        search_query=q,
        skip=skip,
        limit=limit
    )
    return RicePaginationOut(
        items=rices,
        total=total,
        page=(skip // limit) + 1,
        limit=limit,
        total_pages=math.ceil(total / limit) if total > 0 else 0
    )

@router.get("/{rice_id}/stats")
async def get_rice_stats(
    rice_id: int,
    db: AsyncSession = Depends(get_db)
):
    stats = await rice_service.get_rice_stats(db, rice_id)
    return stats

@router.patch("/{rice_id}", response_model=RiceOut)
async def update_rice(
    rice_id: int,
    rice_data: RiceUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    rice = await rice_service.update_rice(
        db=db,
        rice_id=rice_id,
        user_id=user_id,
        rice_data=rice_data
    )
    return rice

@router.delete("/{rice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rice(
    rice_id: int,
    soft_delete: bool = Query(True, description="Soft delete (recoverable) or hard delete"),
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    await rice_service.delete_rice(
        db=db,
        rice_id=rice_id,
        user_id=user_id,
        soft_delete=soft_delete
    )
    return None

@router.post("/{rice_id}/click-dotfile", status_code=status.HTTP_204_NO_CONTENT)
async def track_dotfile_click(
    rice_id: int,
    db: AsyncSession = Depends(get_db)
):
    await rice_service.increment_dotfile_clicks(db, rice_id)
    return None