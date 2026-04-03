from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import issues,users,analytics

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CivicLens API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all origins. We will restrict this in production.
    allow_credentials=True,
    allow_methods=["*"], # Allow all methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(issues.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"status": "success", "message": "Welcome to the CivicLens API"}
