from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
import models

router=APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/summary")
def get_analytics_summary(db:Session=Depends(get_db)):
    total_issues=db.query(models.Issue).count()
    
    status_counts= db.query(
        models.Issue.status,
        func.count(models.Issue.id)
    ).group_by(models.Issue.status).all()
    category_counts = db.query(models.Issue.category, func.count(models.Issue.id)).group_by(models.Issue.category).all()
    by_category = {category: count for category, count in category_counts}
    summary={
        "total": total_issues,
        "by_status": {status: count for status, count in status_counts},
        "by_category": by_category
    }
    
    return summary