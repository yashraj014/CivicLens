from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.issue import Issue
from backend.schemas.issue import IssueCreate

router = APIRouter()

@router.post("/report")
def report_issue(issue: IssueCreate, db: Session = Depends(get_db)):

    new_issue = Issue(
        title=issue.title,
        description=issue.description,
        latitude=issue.latitude,
        longitude=issue.longitude
    )

    db.add(new_issue)
    db.commit()

    return {"message": "Issue reported successfully"}