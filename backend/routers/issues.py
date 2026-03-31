from fastapi import FastAPI,Response,status,HTTPException,Depends,APIRouter
from typing import List,Optional
from sqlalchemy.orm import Session
from database import get_db
import schemas
import auth
import models

router = APIRouter(
    prefix='/issues',
    tags=['issues']
)

@router.post("/create")
def create_issue(
    issue: schemas.IssueCreate,
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user)
):
    new_issue = models.Issue(
        **issue.model_dump(),
        reporter_id=int(user["sub"])  
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return new_issue