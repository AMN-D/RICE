from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from enum import Enum

class MediaTypeEnum(str, Enum):
  IMAGE = "IMAGE"
  VIDEO = "VIDEO"

class ThemeMediaBase(BaseModel):
  url: HttpUrl
  media_type: MediaTypeEnum
  display_order: int = Field(0, ge=0)
  thumbnail_url: HttpUrl | None = None

class ThemeMediaCreate(ThemeMediaBase):
  pass

class ThemeMediaUpdate(BaseModel):
  url: HttpUrl | None = None
  display_order: int | None = Field(None, ge=0)
  thumbnail_url: HttpUrl | None = None

class ThemeMediaOut(ThemeMediaBase):
  id: int
  theme_id: int
  date_added: datetime

  class Config:
    from_attributes = True
