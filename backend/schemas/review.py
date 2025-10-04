from pydantic import BaseModel, Field
from datetime import datetime

class ReviewBase(BaseModel):
  rating: int = Field(..., ge=1, le=5)
  comment: str | None = Field(None, max_length=2000)

class ReviewCreate(ReviewBase):
  pass

class ReviewUpdate(BaseModel):
  rating: int | None = Field(None, ge=1, le=5)
  comment: str | None = Field(None, max_length=2000)

class ReviewOut(ReviewBase):
  id: int
  user_id: int
  rice_id: int
  helpful_count: int
  date_created: datetime
  date_updated: datetime | None = None
  username: str | None = None

  class Config:
    from_attributes = True