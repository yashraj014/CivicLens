from pydantic import BaseModel

class IssueCreate(BaseModel):
    title: str
    description: str
    latitude: str
    longitude: str

class IssueResponse(BaseModel):
    id: int
    title: str
    description: str
    latitude: str
    longitude: str
    image_url: str | None
    status: str
    user_id: int

    class Config:
        orm_mode = True