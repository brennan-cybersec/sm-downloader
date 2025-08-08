export const detectPlatform = (url: string): string | null => {
  const urlLower = url.toLowerCase()
  
  if (urlLower.includes('tiktok.com') || urlLower.includes('vm.tiktok.com') || urlLower.includes('vt.tiktok.com')) {
    return 'tiktok'
  }
  
  if (urlLower.includes('instagram.com') || urlLower.includes('instagr.am')) {
    return 'instagram'
  }
  
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com') || urlLower.includes('t.co')) {
    return 'twitter'
  }
  
  if (urlLower.includes('snapchat.com') || urlLower.includes('snap.com')) {
    return 'snapchat'
  }
  
  return null
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export const getPlatformColor = (platform: string): string => {
  const colors: { [key: string]: string } = {
    tiktok: '#ff0050',
    instagram: '#e4405f',
    twitter: '#1da1f2',
    snapchat: '#fffc00'
  }
  return colors[platform] || '#666666'
}

export const getPlatformIcon = (platform: string): string => {
  const icons = {
    tiktok: '🎵',
    instagram: '📷',
    twitter: '🐦',
    snapchat: '👻'
  }
  return icons[platform as keyof typeof icons] || '📄'
}
