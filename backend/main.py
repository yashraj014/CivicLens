from fastapi import FastAPI
from backend.database import engine, Base
from backend.models import users
from backend.routes import auth,issues

app= FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message": "CivicLens API is running"}

app.include_router(auth.router)
app.include_router(issues.router, prefix="/issues", tags=["Issues"])