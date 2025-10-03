from pydantic import BaseModel, EmailStr, Field

class ProfileBase(BaseModel):
    username: str = Field(..., max_length=30)
    bio: str | None = None
    github_url: str | None = None
    avatar_url: str | None = None

class ProfileOut(ProfileBase):
    id: int

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