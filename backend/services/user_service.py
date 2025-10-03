from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.user import User, Profile

async def get_user_by_google_id(db: AsyncSession, google_id: str) -> User | None:
    result = await db.execute(select(User).where(User.google_id == google_id))
    return result.scalars().first()
  
async def create_user(db: AsyncSession, google_id: str, email: str, name: str | None = None, picture: str | None = None) -> User:
    new_user = User(
        google_id=google_id,
        email=email,
        name=name,
        picture=picture
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user

async def get_profile_by_user_id(db: AsyncSession, user_id: int) -> Profile | None:
    result = await db.execute(select(Profile).where(Profile.id == user_id))
    return result.scalars().first()

async def create_profile(
    db: AsyncSession, 
    user_id: int, 
    username: str, 
    bio: str | None = None, 
    github_url: str | None = None,
    avatar_url: str | None = None 
    ) -> Profile:
    new_profile = Profile(
        id=user_id,
        username=username,
        bio=bio,
        github_url=github_url,
        avatar_url=avatar_url
    )
    db.add(new_profile)
    await db.commit()
    await db.refresh(new_profile)
    return new_profile