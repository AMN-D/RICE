from fastapi import APIRouter, Depends, HTTPException, Request
from itsdangerous import URLSafeSerializer, BadSignature
from fastapi.responses import RedirectResponse, Response
from services import user_service, google_auth, jwt_service
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.user import UserOut
from db.session import get_db
from config.settings import settings
import secrets

router = APIRouter(prefix="/auth", tags=["authentication"])
serializer = URLSafeSerializer(settings.SESSION_SECRET_KEY, salt="oauth")

@router.get("/login")
async def login(request: Request):
    state = serializer.dumps({"nonce": secrets.token_urlsafe(16)})
    auth_url = google_auth.build_auth_url(state)
    return RedirectResponse(auth_url)

@router.get("/callback")
async def callback(
    request: Request, 
    code: str = None, 
    state: str = None, 
    error: str = None, 
    db: AsyncSession = Depends(get_db)
    ):
    if error:
        raise HTTPException(status_code=400, detail=f"OAuth error: {error}")

    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")

    try:
        data = serializer.loads(state)
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid state token")

    tokens = await google_auth.exchange_code_for_tokens(code)
    id_token = tokens.get("id_token")
    user_info = google_auth.decode_id_token(id_token)

    user = await user_service.get_user_by_google_id(db, user_info["sub"])
    if not user:
        user = await user_service.create_user(
            db,
            google_id=user_info["sub"],
            email=user_info["email"],
            name=user_info.get("name"),
            picture=user_info.get("picture")
        )

    from services import jwt_service
    token = jwt_service.create_access_token(user.id)

    response = RedirectResponse(url="http://localhost:5173")
    response.set_cookie(
        key="access_token", 
        value=token, 
        httponly=True, 
        secure=True, 
        samesite="none",
        max_age=7*24*60*60,  # 7 days
    )

    return response

@router.post("/logout")
async def logout(
    response: Response,
    user_id: int = Depends(jwt_service.get_current_user)
):

    response.delete_cookie(
        key="access_token",
        path="/",
        httponly=True,
        secure=True,  
        samesite="none"
    )
    
    return {
        "message": "Successfully logged out",
        "user_id": user_id
    }


    
