from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

from models import IssueCategory, IssueStatus

class UserBase(BaseModel):
    email:EmailStr
    full_name:str

class UserCreate(UserBase):
    password:str

class UserResponse(UserBase):
    id:int
    is_authority:bool
    created_at:datetime

    model_config = ConfigDict(from_attributes=True)

class IssueBase(BaseModel):
    title:str
    description:str
    category:IssueCategory
    latitude:float
    longitude:float

    image_url: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class IssueResponse(IssueBase):
    id:int
    status:IssueStatus
    upvote_count:int
    reporter_id:int
    created_at:datetime
    updated_at:datetime

    model_config = ConfigDict(from_attributes=True)  