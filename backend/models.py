# import uuid
from sqlalchemy import Column, Integer, String, Text, ForeignKey,Boolean,DateTime
from sqlalchemy.sql import func
from backend.database import Base

class User(Base):
    __tablename__="users"
    
    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)
    full_name=Column(String,nullable=False)
    is_authority=Column(Boolean,default=False,nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer,primary_key=True,index=True)
    title = Column(String,nullable=False)
    description = Column(Text,nullable=False)
    is_resolved = Column(Boolean, default=False,nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())