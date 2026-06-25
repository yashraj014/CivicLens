from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import issues,users,analytics
import os
from fastapi.staticfiles import StaticFiles

os.makedirs("uploads", exist_ok=True)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicLens API", version="1.0.0")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://civiclens-profile.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(issues.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"status": "success", "message": "Welcome to the CivicLens API"}
