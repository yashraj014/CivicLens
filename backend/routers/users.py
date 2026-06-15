from fastapi import FastAPI,Response,status,HTTPException,Depends,APIRouter
from typing import List,Optional
from sqlalchemy.orm import Session
from database import get_db
import schemas
import auth
import models

router = APIRouter(
    prefix='/users',
    tags=['users']
)

@router.post('/register',response_model=schemas.UserResponse,status_code=status.HTTP_201_CREATED)
def register_user(user:schemas.UserCreate, db:Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email Already Registered")
    

    is_auth_user = False
    if user.authority_secret:
        if user.authority_secret == "CityHall2024":
            is_auth_user=True
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Invalid authority secret code")
        
    hashed_password = auth.get_password_hash(user.password)

    new_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name =user.full_name,
        is_authority=is_auth_user
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.post('/login')
def login_user(user_credentials:schemas.UserLogin,db:Session=Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    if not user or not auth.verify_password(user_credentials.password,user.hashed_password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='Invalid credentials')
    
    access_token = auth.create_access_token(
        data={"sub": str(user.id),
            "is_authority": user.is_authority
        }
    )

    return {"access_token":access_token,"token_type":"bearer"}

@router.get("/me")
def get_me(user=Depends(auth.get_current_user)):
    return {"user": user}