import yt_dlp
import os
import asyncio
import json
from datetime import datetime
from typing import Dict, Optional, Any
import aiofiles
from pathlib import Path
import time

class ProgressHook:
    def __init__(self, download_id: str, download_status: Dict):
        self.download_id = download_id
        self.download_status = download_status
    
    def __call__(self, d):
        if d['status'] == 'downloading':
            # Update progress
            if 'total_bytes' in d and d['total_bytes']:
                progress = (d['downloaded_bytes'] / d['total_bytes']) * 100
                self.download_status[self.download_id]["progress"] = progress
                self.download_status[self.download_id]["message"] = f"Downloading... {progress:.1f}%"
            elif 'total_bytes_estimate' in d and d['total_bytes_estimate']:
                progress = (d['downloaded_bytes'] / d['total_bytes_estimate']) * 100
                self.download_status[self.download_id]["progress"] = progress
                self.download_status[self.download_id]["message"] = f"Downloading... {progress:.1f}%"
        
        elif d['status'] == 'finished':
            self.download_status[self.download_id]["progress"] = 100.0
            self.download_status[self.download_id]["message"] = "Download completed, processing..."

class DownloadService:
    def __init__(self):
        # Use absolute path to downloads directory
        current_dir = Path(__file__).parent.parent.parent.parent
        self.downloads_dir = current_dir / "downloads"
        self.downloads_dir.mkdir(exist_ok=True)
        self.download_status = {}
        
        # Create platform-specific directories
        for platform in ["tiktok", "instagram", "twitter", "snapchat"]:
            platform_dir = self.downloads_dir / platform
            platform_dir.mkdir(exist_ok=True)
    
    async def download_content(
        self, 
        download_id: str, 
        url: str, 
        platform: str, 
        quality: str = "best",
        audio_only: bool = False
    ):
        """
        Download content from social media platforms
        """
        max_retries = 3
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                # Update status to downloading
                self.download_status[download_id] = {
                    "id": download_id,
                    "url": url,
                    "platform": platform,
                    "status": "downloading",
                    "progress": 0.0,
                    "started_at": datetime.now().isoformat(),
                    "message": f"Starting {'audio' if audio_only else 'video'} download... (attempt {retry_count + 1}/{max_retries})",
                    "audio_only": audio_only
                }
                
                # Configure yt-dlp options based on platform and quality
                ydl_opts = self._get_ydl_options(platform, quality, audio_only)
                
                # Set output path
                output_path = self.downloads_dir / platform / f"{download_id}"
                output_path.mkdir(exist_ok=True)
                
                if audio_only:
                    # Audio-only download
                    ydl_opts["outtmpl"] = str(output_path) + "/%(title)s.%(ext)s"
                    ydl_opts["extract_audio"] = True
                    ydl_opts["audio_format"] = quality if quality in ['mp3', 'm4a', 'opus', 'aac'] else 'mp3'
                    ydl_opts["audio_quality"] = "0"  # Best audio quality
                else:
                    # Video download
                    ydl_opts["outtmpl"] = str(output_path) + "/%(title)s.%(ext)s"
                
                # Add progress hook
                progress_hook = ProgressHook(download_id, self.download_status)
                ydl_opts["progress_hooks"] = [progress_hook]
                
                # Download using yt-dlp
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    # Get info first
                    info = ydl.extract_info(url, download=False)
                    
                    # Update status with file info
                    self.download_status[download_id]["file_info"] = {
                        "title": info.get("title", "Unknown"),
                        "duration": info.get("duration"),
                        "uploader": info.get("uploader", "Unknown"),
                        "view_count": info.get("view_count"),
                        "like_count": info.get("like_count"),
                        "description": info.get("description", "")[:200] + "..." if info.get("description") else ""
                    }
                    
                    # Download the content
                    ydl.download([url])
                
                # Update status to completed
                self.download_status[download_id].update({
                    "status": "completed",
                    "progress": 100.0,
                    "completed_at": datetime.now().isoformat(),
                    "message": f"{'Audio' if audio_only else 'Video'} download completed successfully",
                    "file_path": str(output_path)
                })
                
                # Success - break out of retry loop
                break
                
            except Exception as e:
                retry_count += 1
                error_msg = str(e)
                
                # Update status with retry information
                if retry_count < max_retries:
                    self.download_status[download_id].update({
                        "status": "retrying",
                        "error": error_msg,
                        "message": f"Download failed, retrying... (attempt {retry_count + 1}/{max_retries})"
                    })
                    # Wait before retry
                    await asyncio.sleep(2)
                else:
                    # Final failure
                    self.download_status[download_id].update({
                        "status": "failed",
                        "error": error_msg,
                        "completed_at": datetime.now().isoformat(),
                        "message": f"Download failed after {max_retries} attempts: {error_msg}"
                    })
    
    def _get_ydl_options(self, platform: str, quality: str, audio_only: bool = False) -> Dict[str, Any]:
        """
        Get yt-dlp options for specific platform and quality
        """
        base_options = {
            "writeinfojson": True,
            "writesubtitles": True,
            "writeautomaticsub": True,
            "ignoreerrors": False,
            "no_warnings": False,
            "quiet": False,
            "verbose": True,
            "nocheckcertificate": True,
            "extract_flat": False,
            "no_color": True,
            # Remove browser cookies dependency
            "cookiefile": None,
            "cookiesfrombrowser": None,
            # Add user agent to avoid some blocks
            "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            # Add timeout and retry settings
            "socket_timeout": 30,
            "retries": 3,
            "fragment_retries": 3,
            # Add headers to avoid blocks
            "http_headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-us,en;q=0.5",
                "Accept-Encoding": "gzip,deflate",
                "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                "Connection": "keep-alive",
            }
        }
        
        # Set format based on quality and audio preference
        if audio_only:
            base_options["format"] = "bestaudio/best"
            base_options["extract_audio"] = True
            base_options["audio_format"] = quality if quality in ['mp3', 'm4a', 'opus', 'aac'] else 'mp3'
            base_options["audio_quality"] = "0"  # Best audio quality
        else:
            # Video quality mapping
            quality_map = {
                "best": "best[height<=2160]",
                "worst": "worst",
                "4k": "best[height<=2160]",
                "1440p": "best[height<=1440]",
                "1080p": "best[height<=1080]",
                "720p": "best[height<=720]",
                "480p": "best[height<=480]",
                "360p": "best[height<=360]",
                "240p": "best[height<=240]",
                "180p": "best[height<=180]"
            }
            base_options["format"] = quality_map.get(quality, "best[height<=1080]")
        
        # Platform-specific options
        if platform == "tiktok":
            base_options.update({
                "extract_audio": audio_only,
                "audio_format": "mp3" if audio_only else None
            })
        elif platform == "instagram":
            base_options.update({
                "extract_audio": audio_only,
                # Instagram specific options for better compatibility
                "extractor_args": {
                    "instagram": {
                        "login": None,
                        "password": None,
                        "api": False,
                        "check_private": False
                    }
                },
                # Additional Instagram-specific headers
                "http_headers": {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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
                # Instagram-specific format preferences
                "format_sort": ["res:1080", "res:720", "res:480", "res:360"],
                "format_sort_force": True,
                # Add referer for Instagram
                "referer": "https://www.instagram.com/",
                # Disable age verification
                "age_limit": 0
            })
        elif platform == "twitter":
            base_options.update({
                "extract_audio": audio_only
            })
        elif platform == "snapchat":
            base_options.update({
                "extract_audio": audio_only
            })
        
        return base_options
    
    def get_download_status(self, download_id: str) -> Optional[Dict]:
        """
        Get download status by ID
        """
        return self.download_status.get(download_id)
    
    def get_download_history(self) -> Dict:
        """
        Get all download history
        """
        return {
            "downloads": list(self.download_status.values()),
            "total": len(self.download_status)
        }
    
    async def cleanup_old_downloads(self, days: int = 7):
        """
        Clean up downloads older than specified days
        """
        # Implementation for cleanup logic
        pass
