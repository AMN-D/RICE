from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import UserCreate
from models.user import User

def hash_password(password: str) -> str:
    hash_password = "hashed_" + password
    return hash_password

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
  db_user = User(
    email=user_in.email, 
    hashed_password=hash_password(user_in.password)
  )
  db.add(db_user)
  await db.commit()
  await db.refresh(db_user)

  return db_user 
