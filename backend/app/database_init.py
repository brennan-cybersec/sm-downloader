from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from .database import Base, DATABASE_URL
from .models import User, Download
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database by creating all tables"""
    try:
        # Create engine
        engine = create_engine(DATABASE_URL)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        
        # Create session
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        
        # Check if we need to seed initial data
        user_count = db.query(User).count()
        if user_count == 0:
            seed_initial_data(db)
            logger.info("Initial data seeded successfully")
        
        db.close()
        return True
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        return False

def seed_initial_data(db):
    """Seed the database with initial data"""
    try:
        # Create a default admin user (you should change these credentials)
        admin_user = User(
            username="admin",
            email="admin@smdownloader.com",
            hashed_password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KqjqG",  # "admin123"
            is_active=True,
            is_verified=True,
            subscription_type="premium",
            downloads_limit=1000,
            downloads_used=0
        )
        
        db.add(admin_user)
        db.commit()
        logger.info("Default admin user created")
        
    except Exception as e:
        logger.error(f"Error seeding initial data: {e}")
        db.rollback()

def reset_db():
    """Reset the database by dropping all tables and recreating them"""
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
        
        # Recreate tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables recreated successfully")
        
        # Seed initial data
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        db = SessionLocal()
        seed_initial_data(db)
        db.close()
        
        logger.info("Database reset completed successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        return False

if __name__ == "__main__":
    print("Initializing database...")
    if init_db():
        print("Database initialized successfully!")
    else:
        print("Failed to initialize database!")
