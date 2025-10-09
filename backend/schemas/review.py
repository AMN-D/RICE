from pydantic import BaseModel, Field, model_validator
from datetime import datetime
from typing import Any

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

    @model_validator(mode='before')
    @classmethod
    def extract_username(cls, data: Any) -> Any:
        if isinstance(data, dict):
            return data
        # data is a SQLAlchemy model
        username = None
        if hasattr(data, 'user') and data.user:
            if hasattr(data.user, 'profiles') and data.user.profiles:
                username = data.user.profiles.username
        
        return {
            'id': data.id,
            'user_id': data.user_id,
            'rice_id': data.rice_id,
            'rating': data.rating,
            'comment': data.comment,
            'helpful_count': data.helpful_count,
            'date_created': data.date_created,
            'date_updated': data.date_updated,
            'username': username
        }

    class Config:
        from_attributes = True