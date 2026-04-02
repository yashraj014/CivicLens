from fastapi import status,HTTPException,Depends,APIRouter,Query
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

@router.post("/create",response_model=schemas.IssueResponse,status_code=status.HTTP_201_CREATED)
def create_issue(
    issue: schemas.IssueCreate,
    db: Session = Depends(get_db),
    current_user:models.User = Depends(auth.get_current_user)
):
    new_issue = models.Issue(
        **issue.model_dump(),
        reporter_id=int(current_user["sub"]) 
    )

    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)

    return new_issue

@router.get('/fetch',response_model=List[schemas.IssueResponse])
def get_issues(
    skip: int=Query(0, description="Number of records to skip"),
    limit: int=Query(50, description="Number of records to return"),
    category:Optional[models.IssueCategory] = None,
    issue_status:Optional[models.IssueStatus]=Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(models.Issue)

    if category:
        query = query.filter(models.Issue.category == category)

    if issue_status:
        query = query.filter(models.Issue.status == issue_status)

    issues = query.order_by(
        models.Issue.upvote_count.desc(),
        models.Issue.created_at.desc()
    ).offset(skip).limit(limit).all()

    return issues

@router.get('/{issue_id}', response_model=schemas.IssueResponse)
def get_single_issue(issue_id:int,db:Session = Depends(get_db)):
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    return issue

@router.patch('/{issue_id}/status', response_model=schemas.IssueResponse)
def update_issue_status(
    issue_id:int,
    status_update: schemas.IssueStatus,
    db: Session = Depends(get_db),
    current_user:models.User = Depends(auth.get_current_user)
):
    if not current_user.is_authority:
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to change issue status."
        )
    
    issue = db.query(models.Issue).filter(models.Issue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")
    
    issue.status = status_update.status
    db.commit()
    db.refresh(issue)
    return issue

@router.post("/{id}/upvote", response_model=schemas.IssueResponse)
def toggle_upvote(id: int, db: Session = Depends(get_db), current_user = Depends(auth.get_current_user)):
    user_id = current_user.get("sub")
    issue = db.query(models.Issue).filter(models.Issue.id == id).first()
    
    if not issue:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Issue not found")

    existing_upvote = db.query(models.Upvote).filter(
        models.Upvote.issue_id == id,
        models.Upvote.user_id == user_id
    ).first()

    if existing_upvote:
        db.delete(existing_upvote)
        issue.upvote_count -= 1
        db.commit()
        db.refresh(issue)
        return issue
    
    else:
        new_upvote = models.Upvote(issue_id=id, user_id=user_id)
        db.add(new_upvote)
        issue.upvote_count += 1
        db.commit()
        db.refresh(issue)
        return issue
