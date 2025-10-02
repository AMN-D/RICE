from fastapi import FastAPI 
import routers.user

app = FastAPI()
app.include_router(routers.user.router, prefix="/api", tags=["users"])

@app.get("/")
async def server_status():
    return {"server_status": "running"}