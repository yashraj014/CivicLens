from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.users import User
from backend.schemas.user import UserCreate,UserLogin,Token
from backend.services.security import hash_password,verify_password
from backend.services.jwt_handler import create_access_token
from fastapi.security import OAuth2PasswordRequestForm

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

@router.post("/login",response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(data={"user_id": db_user.id})

    return {
        "access_token": token,
        "token_type": "bearer"
    }