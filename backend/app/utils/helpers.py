import re
from typing import Optional
from urllib.parse import urlparse

def detect_platform(url: str) -> Optional[str]:
    """
    Detect social media platform from URL
    """
    url_lower = url.lower()
    
    # TikTok patterns
    tiktok_patterns = [
        r'tiktok\.com',
        r'vm\.tiktok\.com',
        r'vt\.tiktok\.com'
    ]
    
    # Instagram patterns
    instagram_patterns = [
        r'instagram\.com',
        r'instagr\.am'
    ]
    
    # Twitter/X patterns
    twitter_patterns = [
        r'twitter\.com',
        r'x\.com',
        r't\.co'
    ]
    
    # Snapchat patterns
    snapchat_patterns = [
        r'snapchat\.com',
        r'snap\.com'
    ]
    
    # Check each platform
    for pattern in tiktok_patterns:
        if re.search(pattern, url_lower):
            return "tiktok"
    
    for pattern in instagram_patterns:
        if re.search(pattern, url_lower):
            return "instagram"
    
    for pattern in twitter_patterns:
        if re.search(pattern, url_lower):
            return "twitter"
    
    for pattern in snapchat_patterns:
        if re.search(pattern, url_lower):
            return "snapchat"
    
    return None

def validate_url(url: str) -> bool:
    """
    Validate if URL is properly formatted
    """
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename for safe file system usage
    """
    # Remove or replace invalid characters
    invalid_chars = '<>:"/\\|?*'
    for char in invalid_chars:
        filename = filename.replace(char, '_')
    
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    
    # Limit length
    if len(filename) > 200:
        filename = filename[:200]
    
    return filename

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human readable format
    """
    if size_bytes == 0:
        return "0B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f}{size_names[i]}"

def get_platform_info(platform: str) -> dict:
    """
    Get platform-specific information
    """
    platform_info = {
        "tiktok": {
            "name": "TikTok",
            "supported_content": ["videos", "audio"],
            "max_duration": 600,  # 10 minutes
            "formats": ["mp4", "webm"]
        },
        "instagram": {
            "name": "Instagram",
            "supported_content": ["posts", "stories", "reels", "igtv"],
            "max_duration": 3600,  # 1 hour for IGTV
            "formats": ["mp4", "jpg", "png"]
        },
        "twitter": {
            "name": "X (Twitter)",
            "supported_content": ["tweets", "videos", "images"],
            "max_duration": 600,  # 10 minutes
            "formats": ["mp4", "jpg", "png"]
        },
        "snapchat": {
            "name": "Snapchat",
            "supported_content": ["stories", "snaps"],
            "max_duration": 300,  # 5 minutes
            "formats": ["mp4", "jpg"]
        }
    }
    
    return platform_info.get(platform, {})

def extract_video_id(url: str, platform: str) -> Optional[str]:
    """
    Extract video ID from URL
    """
    if platform == "tiktok":
        # TikTok video ID extraction
        pattern = r'/video/(\d+)'
        match = re.search(pattern, url)
        return match.group(1) if match else None
    
    elif platform == "instagram":
        # Instagram post ID extraction
        pattern = r'/p/([A-Za-z0-9_-]+)'
        match = re.search(pattern, url)
        return match.group(1) if match else None
    
    elif platform == "twitter":
        # Twitter tweet ID extraction
        pattern = r'/status/(\d+)'
        match = re.search(pattern, url)
        return match.group(1) if match else None
    
    return None
