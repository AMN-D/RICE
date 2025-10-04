from pydantic import BaseModel, Field
from datetime import datetime
from schemas.theme_media import ThemeMediaOut, ThemeMediaCreate

class ThemeBase(BaseModel):
  name: str = Field(min_length=1, max_length=100)
  description: str | None = None
  tags: str | None = Field(None, max_length=500)
  display_order: int = Field(0, ge=0)

class ThemeCreate(ThemeBase):
  media: list[ThemeMediaCreate] = Field(..., min_length=1)

class ThemeUpdate(BaseModel):
  name: str | None = Field(None, min_length=1, max_length=100)
  description: str | None = None
  tags: str | None = Field(None, max_length=500)
  display_order: int | None = Field(None, ge=0)

class ThemeOut(ThemeBase):
  id: int
  rice_id: int
  date_added: datetime
  media: list[ThemeMediaOut] = []

  class Config:
    from_attributes = True

class ThemeOutSimple(ThemeBase):
  id: int
  rice_id: int
  date_added: datetime
  media_count: int = 0

  class Config:
    from_attributes = True