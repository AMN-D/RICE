from pydantic import HttpUrl, BaseModel, EmailStr, Field
from typing import Optional

class ProfileBase(BaseModel):
    username: str = Field(..., max_length=30)
    bio: str | None = None
    github_url: str | None = None
    avatar_url: str | None = None

class ProfileOut(ProfileBase):
    id: int

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    github_url: Optional[HttpUrl] = None
    avatar_url: Optional[HttpUrl] = None

class PublicProfileOut(BaseModel):
    id: int
    username: str
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    github_url: Optional[str] = None
    picture: Optional[str] = None  # Google profile picture
    
    class Config:
        from_attributes = True


class ProfileOut(BaseModel):
    id: int
    username: str
    bio: Optional[str] = None
    github_url: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    name: str | None = None
    picture: str | None = None

class UserOut(UserBase):
    id: int
    profiles: ProfileOut | None = None

    class Config:
        from_attributes = True