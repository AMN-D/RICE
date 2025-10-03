from config.settings import settings
from fastapi import FastAPI 
from routers import auth, profile

app = FastAPI()
app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
async def server_status():
    return {"server_status": "running"}

@app.get("/dashboard")
async def dashboard():
    return {"greetings": "Welcome to Rice!"}