# import uuid
import enum
from sqlalchemy import Column, Integer, String,Float, Text, ForeignKey,Boolean,DateTime,Enum as SQLEnum
# from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__="users"
    
    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)
    full_name=Column(String,nullable=False)
    is_authority=Column(Boolean,default=False,nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class IssueCategory(str, enum.Enum):
    ROAD="Road"
    WATER="Water"
    ELECTRICITY="Electricity"
    SANITATION="Sanitation"
    
class IssueStatus(str, enum.Enum):
    REPORTED = "Reported"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"

    
class Issue(Base):
    __tablename__ = "issues"
    
    id = Column(Integer,primary_key=True,index=True)
    title = Column(String,nullable=False)
    description = Column(Text,nullable=False)
    
    status = Column(SQLEnum(IssueStatus), default=IssueStatus.REPORTED,nullable=False)
    category=Column(SQLEnum(IssueCategory),nullable=False)
    
    latitude=Column(Float,nullable=False)
    longitude=Column(Float,nullable=False)
    
    image_url = Column(String, nullable=True)
    upvote_count = Column(Integer, default=0, nullable=False)
    
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())