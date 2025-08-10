#!/usr/bin/env python3
"""
Simple database test script to verify database connection and models
"""

import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal, engine
from app.models import User, Download
from app.database_init import init_db
from sqlalchemy import text

def test_database_connection():
    """Test basic database connection"""
    try:
        # Test engine connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful")
            return True
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False

def test_models():
    """Test model creation and basic operations"""
    try:
        db = SessionLocal()
        
        # Test User model
        test_user = User(
            username="testuser",
            email="test@example.com",
            hashed_password="test_hash",
            is_active=True
        )
        
        # Test Download model
        test_download = Download(
            user_id=1,
            url="https://example.com/test",
            platform="instagram",
            quality="best",
            status="pending"
        )
        
        print("✓ Models created successfully")
        
        # Test table creation
        from app.database import Base
        Base.metadata.create_all(bind=engine)
        print("✓ Tables created successfully")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"✗ Model test failed: {e}")
        return False

def test_crud_operations():
    """Test basic CRUD operations"""
    try:
        db = SessionLocal()
        
        # Create a test user
        test_user = User(
            username="crudtest",
            email="crud@example.com",
            hashed_password="test_hash",
            is_active=True
        )
        db.add(test_user)
        db.commit()
        print("✓ User created successfully")
        
        # Read the user
        user = db.query(User).filter(User.username == "crudtest").first()
        if user:
            print(f"✓ User read successfully: {user.username}")
        else:
            print("✗ User read failed")
            return False
        
        # Update the user
        user.is_active = False
        db.commit()
        print("✓ User updated successfully")
        
        # Delete the user
        db.delete(user)
        db.commit()
        print("✓ User deleted successfully")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"✗ CRUD operations failed: {e}")
        return False

def main():
    """Run all database tests"""
    print("Running database tests...")
    print()
    
    # Test 1: Database connection
    print("1. Testing database connection...")
    if not test_database_connection():
        print("Database connection test failed. Exiting.")
        return
    
    # Test 2: Initialize database
    print()
    print("2. Testing database initialization...")
    if init_db():
        print("✓ Database initialized successfully")
    else:
        print("✗ Database initialization failed")
        return
    
    # Test 3: Model creation
    print()
    print("3. Testing models...")
    if not test_models():
        print("Model test failed. Exiting.")
        return
    
    # Test 4: CRUD operations
    print()
    print("4. Testing CRUD operations...")
    if not test_crud_operations():
        print("CRUD operations test failed.")
        return
    
    print()
    print("✓ All database tests passed successfully!")
    print()
    print("Your database is ready to use!")

if __name__ == "__main__":
    main()
