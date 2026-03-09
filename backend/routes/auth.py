from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.users import User
from backend.schemas.user import UserCreate,UserLogin
from backend.services.security import hash_password,verify_password

router = APIRouter()

@router.post("/signup")
def signup(user:UserCreate, db: Session = Depends(get_db)):
    hashed_pw = hash_password(user.password)
    
    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hashed_pw
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {"message": "Login successful"}