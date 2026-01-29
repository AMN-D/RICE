from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from schemas.theme import ThemeOutSimple, ThemeCreate, ThemeOut

class RiceBase(BaseModel):
  name: str = Field(..., min_length=1, max_length=100)
  dotfile_url: HttpUrl

class RiceCreate(RiceBase):
  themes: list[ThemeCreate] = Field(..., min_length=1)

class RiceUpdate(BaseModel):
  name: str | None = Field(None, min_length=1, max_length=100)
  dotfile_url: HttpUrl | None = None

class RiceOut(RiceBase):
  id: int
  user_id: int
  views: int
  dotfile_clicks: int
  date_added: datetime
  date_updated: datetime | None = None
  themes: list[ThemeOut] = []
  avg_rating: float | None = None
  reviews_count: int = 0
  poster_name: str | None = None
  poster_avatar: str | None = None

  class Config:
    from_attributes = True

class RiceCardOut(BaseModel):
  """Minimal schema for homepage rice cards - optimized for performance"""
  id: int
  name: str
  views: int
  date_added: datetime
  date_updated: datetime | None = None
  themes_count: int = 0
  reviews_count: int = 0
  avg_rating: float | None = None
  preview_image: str | None = None
  poster_name: str | None = None

  class Config:
    from_attributes = True

class RiceOutSimple(RiceBase):
  id: int
  user_id: int
  views: int
  dotfile_clicks: int
  date_added: datetime
  themes_count: int = 0
  reviews_count: int = 0
  avg_rating: float | None = None
  preview_image: str | None = None

  class Config:
    from_attributes = True

class RiceOutWithThemes(RiceOutSimple):
  id: int
  user_id: int
  views: int
  dotfile_clicks: int
  date_added: datetime
  themes: list[ThemeOutSimple] = []

  class Config:
    from_attributes = True

class RiceCardPaginationOut(BaseModel):
  """Optimized pagination for homepage cards"""
  items: list[RiceCardOut]
  total: int
  page: int
  limit: int
  total_pages: int

class RicePaginationOut(BaseModel):
  items: list[RiceOutSimple]
  total: int
  page: int
  limit: int
  total_pages: int
