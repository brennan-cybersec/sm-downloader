# Database Setup Guide

This guide will help you set up and manage the database for the Social Media Downloader application.

## Overview

The application uses:
- **SQLAlchemy** as the ORM
- **SQLite** for development (default)
- **PostgreSQL** for production
- **Alembic** for database migrations

## Quick Start

### 1. Environment Setup

Copy the environment template and configure it:

```bash
cp env.example .env
```

Edit `.env` and set your database configuration:

```bash
# For SQLite (development)
DATABASE_URL=sqlite:///./sm_downloader.db

# For PostgreSQL (production)
DATABASE_URL=postgresql://username:password@localhost:5432/sm_downloader
```

### 2. Initialize Database

Use the management script to initialize the database:

```bash
# Initialize database and create tables
python manage_db.py init

# Or reset database (drops all tables and recreates)
python manage_db.py reset
```

### 3. Test Database

Run the test script to verify everything works:

```bash
python test_db.py
```

## Database Management Commands

The `manage_db.py` script provides several useful commands:

```bash
# Initialize database
python manage_db.py init

# Reset database (drop all tables and recreate)
python manage_db.py reset

# Run migrations
python manage_db.py migrate

# Create a new migration
python manage_db.py create-migration -m "Add new field"

# Upgrade to latest migration
python manage_db.py upgrade

# Downgrade to previous migration
python manage_db.py downgrade

# Seed database with initial data
python manage_db.py seed
```

## Database Models

### User Model
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `hashed_password`: Encrypted password
- `is_active`: Account status
- `is_verified`: Email verification status
- `subscription_type`: Free or premium
- `downloads_limit`: Maximum downloads allowed
- `downloads_used`: Current downloads used
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Download Model
- `id`: Primary key
- `user_id`: Foreign key to User
- `url`: Source URL
- `platform`: Social media platform
- `quality`: Download quality preference
- `status`: Download status (pending, downloading, completed, failed)
- `file_path`: Local file path
- `file_size`: File size in bytes
- `error_message`: Error details if failed
- `created_at`: Download request timestamp
- `completed_at`: Completion timestamp

## Migrations with Alembic

### Create a Migration

```bash
python manage_db.py create-migration -m "Description of changes"
```

### Apply Migrations

```bash
python manage_db.py upgrade
```

### Rollback Migrations

```bash
python manage_db.py downgrade
```

### View Migration History

```bash
alembic history
```

### View Current Migration

```bash
alembic current
```

## Database Schema

The database automatically creates these tables:

1. **users** - User accounts and authentication
2. **downloads** - Download history and status

## Development vs Production

### Development (SQLite)
- Uses local SQLite file
- No additional setup required
- Good for development and testing

### Production (PostgreSQL)
- Install PostgreSQL
- Create database and user
- Set `DATABASE_URL` environment variable
- Run migrations

## Troubleshooting

### Common Issues

1. **Database locked**: Close any open connections or restart the application
2. **Migration conflicts**: Check migration history and resolve conflicts
3. **Permission errors**: Ensure proper database user permissions

### Reset Everything

If you need to start fresh:

```bash
python manage_db.py reset
```

This will:
- Drop all tables
- Recreate the schema
- Seed initial data

### Check Database Status

```bash
python test_db.py
```

This will test:
- Database connection
- Model creation
- CRUD operations
- Overall functionality

## Security Notes

- Change default admin credentials in production
- Use strong SECRET_KEY in production
- Limit database user permissions
- Enable SSL for production database connections

## Next Steps

After setting up the database:

1. Start the FastAPI application: `uvicorn app.main:app --reload`
2. Test the API endpoints
3. Set up the frontend to connect to the backend
4. Configure authentication and user management

## Support

If you encounter issues:

1. Check the logs for error messages
2. Verify environment variables are set correctly
3. Ensure all dependencies are installed
4. Run the test script to isolate issues
