from config.settings import settings
from urllib.parse import urlencode
import secrets
import httpx
import jwt

def build_auth_url(state: str) -> str:
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    return f"{settings.GOOGLE_AUTH_URL}?{urlencode(params)}"

async def exchange_code_for_tokens(code: str) -> dict:
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(settings.GOOGLE_TOKEN_URL, data=token_data)
    response.raise_for_status()
    return response.json()

def decode_id_token(id_token: str) -> dict:
    return jwt.decode(id_token, options={"verify_signature": False})