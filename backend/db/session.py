from config.settings import settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker


engine = create_async_engine(
  settings.DATABASE_URL,
  echo=True
)

AsyncSessionLocal = async_sessionmaker(
  bind=engine,
  expire_on_commit=False
)

async def get_db():
  session = AsyncSessionLocal()
  try:
    yield session
  finally:
    await session.close()