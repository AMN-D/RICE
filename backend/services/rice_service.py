from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from models.rice import Rice, Theme, Review, ThemeMedia
from schemas.rice import RiceCreate, RiceUpdate 
from services import theme_service
from typing import optional

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
  return result.scalars_one()

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
  rice = result.scalars_one_or_none()

  if not rice:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Rice not found"
    )

  return rice

async def get_rice_by_user(
  db: AsyncSession,
  user_id: int,
  skip: int = 0,
  limit: int = 20,
  include_deleted: bool = False
  ) -> list[Rice]:

  query = select(Rice).options(
    selectinload(Rice.themes).selectinload(Theme.media)
  ).where(Rice.user_id == user_id)

  if not include_deleted:
    query = query.where(Rice.is_deleted == False)

  query = query.offset(skip).limit(limit).order_by(Rice.date_added.desc())
  result = await db.execute(query)
  return result.scalars().all()

async def get_all_rice(
  db: AsyncSession,
  skip: int = 0,
  limit: int = 20,
  sort_by: str = "recent"
  ) -> list[Rice]:

  query = select(Rice).options(
    selectinload(Rice.themes).selectinload(Theme.media)
  ).where(Rice.is_deleted == False)

  if sort_by == "popular":
    query = query.order_by(Rice.views.desc())
  elif sort_by == "recent":
    query = query.order_by(Rice.date_added.desc())
  else:
    query = query.order_by(Rice.date_added.desc())

  query = query.offset(skip).limit(limit)

  result = await db.execute(query)
  return result.scalars().all()

async def search_rices(
  db: AsyncSession,
  search_query: str,
  skip: int = 0,
  limit: int = 20
  ) -> list[Rice]:

  search_pattern = f"%{search_query}%"

  query = select(Rice).options(
    selectinload(Rice.themes).selectinload(Theme.media)
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
  return result.scalars().all()

