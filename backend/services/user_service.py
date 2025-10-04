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

async def update_profile(
    db: AsyncSession,
    user_id: int,
    username: str | None = None,
    bio: str | None = None,
    github_url: str | None = None,
    avatar_url: str | None = None
) -> Profile | None:

    result = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = result.scalars().first()
    
    if not profile:
        return None
    
    if username is not None:
        profile.username = username
    if bio is not None:
        profile.bio = bio
    if github_url is not None:
        profile.github_url = github_url
    if avatar_url is not None:
        profile.avatar_url = avatar_url
    
    await db.commit()
    await db.refresh(profile)
    return profile

async def delete_user(db: AsyncSession, user_id: int) -> bool:

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        return False
    
    await db.delete(user)
    await db.commit()
    return True

async def get_user_info(db: AsyncSession, user_id: int) -> tuple[User | None, Profile | None]:

    user_result = await db.execute(select(User).where(User.id == user_id))
    user = user_result.scalars().first()
    
    if not user:
        return None, None
    
    profile_result = await db.execute(select(Profile).where(Profile.id == user_id))
    profile = profile_result.scalars().first()
    
    return user, profile