from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware
from config.settings import settings
from routers import auth, media, profile, review, rice, theme, users

app = FastAPI(
    title="Rice Showcase API",
    description="API for sharing Linux customizations (ricing)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
        # "http://localhost:3000",
        # "http://localhost:5173",
        ],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(media.router)
app.include_router(review.router)
app.include_router(rice.router)
app.include_router(theme.router)
app.include_router(users.router)

@app.get("/")
async def server_status():
    return {"server_status": "running"}

@app.get("/dashboard")
async def dashboard():
    return {"greetings": "Welcome to Rice!"}
