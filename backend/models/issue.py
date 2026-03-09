from sqlalchemy import Column, Integer, String, Text, ForeignKey
from backend.database import Base

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)
    description = Column(Text)

    latitude = Column(String)
    longitude = Column(String)

    image_url = Column(String)

    status = Column(String, default="reported")

    user_id = Column(Integer, ForeignKey("users.id"))