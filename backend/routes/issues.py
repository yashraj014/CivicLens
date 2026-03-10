from fastapi import APIRouter, Depends,UploadFile, File, Form
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models.issue import Issue
from backend.schemas.issue import IssueCreate
from backend.services.auth_dependency import get_current_user
from typing import List
from backend.schemas.issue import IssueResponse
import shutil
import os
router = APIRouter()

@router.get("/", response_model=List[IssueResponse])
def get_all_issues(db: Session = Depends(get_db)):

    issues = db.query(Issue).all()

    return issues
@router.post("/report")
def report_issue(
    title: str = Form(...),
    description: str = Form(...),
    latitude: str = Form(...),
    longitude: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    image_path = None

    if image:
        upload_folder = "backend/uploads"
        file_path = os.path.join(upload_folder, image.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        image_path = file_path

    new_issue = Issue(
        title=title,
        description=description,
        latitude=latitude,
        longitude=longitude,
        image_url=image_path,
        user_id=user_id
    )

    db.add(new_issue)
    db.commit()

    return {"message": "Issue reported successfully"}