#!/usr/bin/env python3
"""
Database management script for SM Downloader
Usage: python manage_db.py [command]

Commands:
    init        - Initialize database and create tables
    reset       - Reset database (drop all tables and recreate)
    migrate     - Run database migrations
    create-migration - Create a new migration file
    upgrade     - Upgrade to latest migration
    downgrade  - Downgrade to previous migration
    seed       - Seed database with initial data
"""

import sys
import os
import argparse
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

from app.database_init import init_db, reset_db, seed_initial_data
from app.database import engine, SessionLocal
from app.models import Base

def run_migrations():
    """Run database migrations using Alembic"""
    try:
        import subprocess
        result = subprocess.run(["alembic", "upgrade", "head"], 
                              capture_output=True, text=True, cwd=".")
        if result.returncode == 0:
            print("Migrations completed successfully!")
            print(result.stdout)
        else:
            print("Migration failed!")
            print(result.stderr)
            return False
        return True
    except FileNotFoundError:
        print("Alembic not found. Please install it first: pip install alembic")
        return False

def create_migration(message):
    """Create a new migration file"""
    try:
        import subprocess
        cmd = ["alembic", "revision", "--autogenerate", "-m", message]
        result = subprocess.run(cmd, capture_output=True, text=True, cwd=".")
        if result.returncode == 0:
            print("Migration file created successfully!")
            print(result.stdout)
        else:
            print("Failed to create migration!")
            print(result.stderr)
            return False
        return True
    except FileNotFoundError:
        print("Alembic not found. Please install it first: pip install alembic")
        return False

def downgrade_migration():
    """Downgrade to previous migration"""
    try:
        import subprocess
        result = subprocess.run(["alembic", "downgrade", "-1"], 
                              capture_output=True, text=True, cwd=".")
        if result.returncode == 0:
            print("Downgrade completed successfully!")
            print(result.stdout)
        else:
            print("Downgrade failed!")
            print(result.stderr)
            return False
        return True
    except FileNotFoundError:
        print("Alembic not found. Please install it first: pip install alembic")
        return False

def seed_data():
    """Seed database with initial data"""
    try:
        db = SessionLocal()
        seed_initial_data(db)
        db.close()
        print("Database seeded successfully!")
        return True
    except Exception as e:
        print(f"Error seeding database: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Database management for SM Downloader")
    parser.add_argument("command", choices=[
        "init", "reset", "migrate", "create-migration", 
        "upgrade", "downgrade", "seed"
    ], help="Command to execute")
    parser.add_argument("--message", "-m", help="Migration message (for create-migration)")
    
    args = parser.parse_args()
    
    if args.command == "init":
        print("Initializing database...")
        if init_db():
            print("Database initialized successfully!")
        else:
            print("Failed to initialize database!")
            sys.exit(1)
            
    elif args.command == "reset":
        print("Resetting database...")
        if reset_db():
            print("Database reset successfully!")
        else:
            print("Failed to reset database!")
            sys.exit(1)
            
    elif args.command == "migrate":
        print("Running migrations...")
        if run_migrations():
            print("Migrations completed!")
        else:
            print("Migrations failed!")
            sys.exit(1)
            
    elif args.command == "create-migration":
        if not args.message:
            print("Error: Migration message is required for create-migration")
            print("Usage: python manage_db.py create-migration -m 'your message'")
            sys.exit(1)
        print(f"Creating migration: {args.message}")
        if create_migration(args.message):
            print("Migration created!")
        else:
            print("Failed to create migration!")
            sys.exit(1)
            
    elif args.command == "upgrade":
        print("Upgrading database...")
        if run_migrations():
            print("Upgrade completed!")
        else:
            print("Upgrade failed!")
            sys.exit(1)
            
    elif args.command == "downgrade":
        print("Downgrading database...")
        if downgrade_migration():
            print("Downgrade completed!")
        else:
            print("Downgrade failed!")
            sys.exit(1)
            
    elif args.command == "seed":
        print("Seeding database...")
        if seed_data():
            print("Seeding completed!")
        else:
            print("Seeding failed!")
            sys.exit(1)

if __name__ == "__main__":
    main()
