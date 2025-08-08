from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
import re
import uuid
import os
from pathlib import Path
from app.utils.helpers import detect_platform
from app.services.download_service import DownloadService

router = APIRouter()

class DownloadRequest(BaseModel):
    url: HttpUrl
    quality: Optional[str] = "best"
    platform: Optional[str] = None
    audio_only: Optional[bool] = False

class DownloadResponse(BaseModel):
    id: str
    url: str
    platform: str
    status: str
    progress: Optional[float] = None
    message: Optional[str] = None

# Initialize the actual download service
download_service = DownloadService()

@router.post("/download", response_model=DownloadResponse)
async def download_content(request: DownloadRequest, background_tasks: BackgroundTasks):
    """
    Download content from social media platforms
    """
    try:
        # Detect platform if not provided
        if not request.platform:
            request.platform = detect_platform(str(request.url))
        
        if not request.platform:
            raise HTTPException(status_code=400, detail="Unsupported platform")
        
        # Generate download ID
        download_id = str(uuid.uuid4())
        
        # Start actual download in background
        background_tasks.add_task(
            download_service.download_content,
            download_id,
            str(request.url),
            request.platform,
            request.quality,
            request.audio_only
        )
        
        return DownloadResponse(
            id=download_id,
            url=str(request.url),
            platform=request.platform,
            status="started"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download/{download_id}")
async def get_download_status(download_id: str):
    """
    Get download status and progress
    """
    try:
        status = download_service.get_download_status(download_id)
        if not status:
            raise HTTPException(status_code=404, detail="Download not found")
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/downloads")
async def get_download_history():
    """
    Get download history
    """
    try:
        return download_service.get_download_history()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files/{download_id}")
async def download_file(download_id: str):
    """
    Download the actual file after it's been processed
    """
    try:
        status = download_service.get_download_status(download_id)
        if not status:
            raise HTTPException(status_code=404, detail="Download not found")
        
        if status["status"] != "completed":
            raise HTTPException(status_code=400, detail="Download not completed yet")
        
        file_path = status.get("file_path")
        if not file_path:
            raise HTTPException(status_code=404, detail="File path not found")
        
        # Find the actual file in the directory
        download_dir = Path(file_path)
        if not download_dir.exists():
            raise HTTPException(status_code=404, detail="Download directory not found")
        
        # Look for video and audio files
        video_extensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov']
        audio_extensions = ['.mp3', '.m4a', '.opus', '.aac', '.wav']
        
        # Check if it's an audio download
        is_audio = status.get("audio_only", False)
        
        if is_audio:
            # Look for audio files first
            audio_files = []
            for ext in audio_extensions:
                audio_files.extend(download_dir.glob(f"*{ext}"))
            
            if audio_files:
                audio_file = audio_files[0]
                return FileResponse(
                    path=str(audio_file),
                    filename=audio_file.name,
                    media_type='audio/mpeg'
                )
        
        # Look for video files
        video_files = []
        for ext in video_extensions:
            video_files.extend(download_dir.glob(f"*{ext}"))
        
        if not video_files:
            raise HTTPException(status_code=404, detail="No video file found")
        
        # Return the first video file found
        video_file = video_files[0]
        return FileResponse(
            path=str(video_file),
            filename=video_file.name,
            media_type='video/mp4'
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/platforms")
async def get_supported_platforms():
    """
    Get list of supported platforms
    """
    return {
        "platforms": [
            {
                "name": "tiktok",
                "display_name": "TikTok",
                "supported_content": ["videos", "audio"]
            },
            {
                "name": "instagram",
                "display_name": "Instagram",
                "supported_content": ["posts", "stories", "reels", "igtv"]
            },
            {
                "name": "twitter",
                "display_name": "X (Twitter)",
                "supported_content": ["tweets", "videos", "images"]
            },
            {
                "name": "snapchat",
                "display_name": "Snapchat",
                "supported_content": ["stories", "snaps"]
            }
        ]
    }

@router.post("/test-instagram")
async def test_instagram_download(request: DownloadRequest):
    """
    Test Instagram download specifically
    """
    try:
        if not request.platform or request.platform != "instagram":
            raise HTTPException(status_code=400, detail="This endpoint is for Instagram only")
        
        # Generate download ID
        download_id = str(uuid.uuid4())
        
        # Test the download with more verbose logging
        import yt_dlp
        
        ydl_opts = {
            "format": "best",
            "verbose": True,
            "no_warnings": False,
            "quiet": False,
            "extract_flat": False,
            "nocheckcertificate": True,
            "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "DNT": "1",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Cache-Control": "max-age=0"
            },
            "extractor_args": {
                "instagram": {
                    "login": None,
                    "password": None,
                    "api": False,
                    "check_private": False
                }
            },
            "referer": "https://www.instagram.com/",
            "age_limit": 0
        }
        
        # Test info extraction first
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            try:
                info = ydl.extract_info(str(request.url), download=False)
                return {
                    "status": "success",
                    "message": "Instagram URL is accessible",
                    "info": {
                        "title": info.get("title", "Unknown"),
                        "uploader": info.get("uploader", "Unknown"),
                        "duration": info.get("duration"),
                        "formats": len(info.get("formats", [])),
                        "thumbnail": info.get("thumbnail")
                    }
                }
            except Exception as e:
                return {
                    "status": "error",
                    "message": f"Failed to extract info: {str(e)}",
                    "error": str(e)
                }
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
