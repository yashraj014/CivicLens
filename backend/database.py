import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
import psycopg2
from supabase import create_client


load_dotenv()

DATABASE_URL=os.getenv("DATABASE_URL")

connection = psycopg2.connect(DATABASE_URL)

engine=create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"}
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

Base= declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()