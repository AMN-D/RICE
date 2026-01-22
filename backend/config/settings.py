from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()
class Settings(BaseSettings):
  DATABASE_URL: str
  GOOGLE_CLIENT_ID: str
  GOOGLE_CLIENT_SECRET: str
  GOOGLE_REDIRECT_URI: str
  JWT_SECRET_KEY: str
  SESSION_SECRET_KEY: str
  FRONTEND_URL: str = "http://localhost:5173"
  GOOGLE_AUTH_URL: str = "https://accounts.google.com/o/oauth2/v2/auth"
  GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
settings = Settings()