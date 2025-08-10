import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  Chip,
  Fade,
  Zoom,
} from '@mui/material'
import { 
  Download, 
  CheckCircle, 
  Link as LinkIcon,
  PlayArrow,
  Close,
  Menu,
} from '@mui/icons-material'
import { useMutation } from 'react-query'
import { downloadContent, DownloadRequest } from '../services/api'

const detectPlatform = (url: string): string | null => {
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
  
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube'
  }
  
  if (urlLower.includes('facebook.com') || urlLower.includes('fb.com')) {
    return 'facebook'
  }
  
  return null
}

const getPlatformInfo = (platform: string) => {
  const platformData = {
    tiktok: { name: 'TikTok', color: '#FF0050', icon: '🎵' },
    instagram: { name: 'Instagram', color: '#E4405F', icon: '📷' },
    twitter: { name: 'X (Twitter)', color: '#1DA1F2', icon: '🐦' },
    snapchat: { name: 'Snapchat', color: '#FFFC00', icon: '👻' },
    youtube: { name: 'YouTube', color: '#FF0000', icon: '📺' },
    facebook: { name: 'Facebook', color: '#1877F2', icon: '📘' }
  }
  return platformData[platform as keyof typeof platformData] || { name: 'Unknown', color: '#666', icon: '🔗' }
}

interface DownloadPageProps {
  sidebarOpen?: boolean
}

const DownloadPage: React.FC<DownloadPageProps> = ({ sidebarOpen = true }) => {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('best')
  const [audioOnly, setAudioOnly] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const downloadMutation = useMutation(downloadContent, {
    onSuccess: (data) => {
      console.log('Download started:', data)
      setUrl('')
      setDetectedPlatform(null)
      setShowOptions(false)
    },
    onError: (error) => {
      console.error('Download failed:', error)
    },
  })

  const handleUrlChange = (value: string) => {
    setUrl(value)
    if (value) {
      const platform = detectPlatform(value)
      setDetectedPlatform(platform)
      if (platform) {
        setShowOptions(true)
      }
    } else {
      setDetectedPlatform(null)
      setShowOptions(false)
    }
  }

  const handleDownload = () => {
    if (!url.trim()) return

    const request: DownloadRequest = {
      url: url.trim(),
      quality: audioOnly ? 'audio' : quality,
      platform: detectedPlatform || undefined,
      audio_only: audioOnly,
    }

    downloadMutation.mutate(request)
  }

  const videoQualities = [
    { value: 'best', label: 'Best Quality (Auto)' },
    { value: 'worst', label: 'Lowest Quality (Auto)' },
    { value: '4k', label: '4K (2160p)' },
    { value: '1440p', label: '2K (1440p)' },
    { value: '1080p', label: 'Full HD (1080p)' },
    { value: '720p', label: 'HD (720p)' },
    { value: '480p', label: 'SD (480p)' },
    { value: '360p', label: '360p' },
  ]

  // Rotating platforms for the dynamic heading
  const rotatingPlatforms = [
    'Instagram', 'TikTok', 'Twitter', 'YouTube', 'Facebook', 'Snapchat', 'LinkedIn', 'Pinterest'
  ]

  // Typewriter effect for platform names
  React.useEffect(() => {
    const currentPlatform = detectedPlatform ? getPlatformInfo(detectedPlatform).name : rotatingPlatforms[currentPlatformIndex]
    
    setIsTyping(true)
    setTypedText('')
    
    let index = 0
    const typeInterval = setInterval(() => {
      if (index < currentPlatform.length) {
        setTypedText(currentPlatform.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 100) // Type each character every 100ms
    
    return () => clearInterval(typeInterval)
  }, [currentPlatformIndex, detectedPlatform])

  // Rotate platforms every 3 seconds (increased to allow for typing)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlatformIndex((prev) => (prev + 1) % rotatingPlatforms.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#0A0A0A', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
      '@keyframes blink': {
        '0%, 50%': { opacity: 1 },
        '51%, 100%': { opacity: 0 },
      },
    }}>


      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        maxWidth: sidebarOpen ? 600 : 1200, 
        width: '100%',
        mb: 6,
        transition: 'max-width 0.3s ease',
      }}>
        <Zoom in timeout={800}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'white', 
              fontWeight: 900, 
              mb: 2,
              fontSize: { 
                xs: sidebarOpen ? '1.8rem' : '2.2rem', 
                md: sidebarOpen ? '2.5rem' : '3.5rem',
                lg: sidebarOpen ? '3rem' : '4rem'
              },
              textAlign: 'center',
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            Download Photos & Videos From{' '}
            <span
              style={{
                color: '#667eea',
                minWidth: sidebarOpen ? '140px' : '200px',
                display: 'inline-block',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                verticalAlign: 'baseline',
                lineHeight: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
              }}
            >
              {typedText}
              {isTyping && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    backgroundColor: '#667eea',
                    marginLeft: '2px',
                    animation: 'blink 1s infinite',
                    verticalAlign: 'baseline',
                  }}
                />
              )}
            </span>
          </Typography>
        </Zoom>
        
        <Fade in timeout={1200}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#999', 
              mb: 4,
              fontWeight: 300,
              fontSize: { 
                xs: sidebarOpen ? '0.9rem' : '1.1rem', 
                md: sidebarOpen ? '1.1rem' : '1.4rem',
                lg: sidebarOpen ? '1.2rem' : '1.6rem'
              },
              lineHeight: 1.4,
            }}
          >
            Paste the URL of the post or media and press to download in HD
          </Typography>
        </Fade>

        {/* Main URL Input */}
        <Paper sx={{ 
          p: 4, 
          bgcolor: '#1A1A1A', 
          border: '1px solid #333', 
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          maxWidth: sidebarOpen ? 600 : 900,
          mx: 'auto',
          transition: 'max-width 0.3s ease',
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 3 }}>
                          <TextField
                fullWidth
                label="Paste your URL here"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                variant="outlined"
                sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  fontSize: '1.1rem',
                  '& fieldset': { borderColor: '#444', borderWidth: 2 },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: 2 },
                },
                '& .MuiInputLabel-root': {
                  color: '#999',
                  fontSize: '1rem',
                  '&.Mui-focused': { color: '#667eea' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleDownload}
              disabled={!url.trim() || downloadMutation.isLoading}
              size="large"
              sx={{
                bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
                minWidth: 140,
                height: 56,
                fontSize: '1.1rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              startIcon={
                downloadMutation.isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Download />
                )
              }
            >
              {downloadMutation.isLoading ? 'Starting...' : 'Download'}
            </Button>
          </Box>

          {/* Platform Detection Indicator */}
          {detectedPlatform && (
            <Fade in timeout={500}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 2,
                p: 2,
                bgcolor: '#2A2A2A',
                borderRadius: 2,
                border: '1px solid #444'
              }}>
                <CheckCircle sx={{ color: '#4CAF50', fontSize: 24 }} />
                <Typography variant="body1" sx={{ color: '#4CAF50', fontWeight: 500 }}>
                  Detected: {getPlatformInfo(detectedPlatform).name}
                </Typography>
                <Chip 
                  label={getPlatformInfo(detectedPlatform).icon}
                  sx={{ 
                    bgcolor: getPlatformInfo(detectedPlatform).color,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Fade>
          )}
        </Paper>
      </Box>

      {/* Download Options */}
      {showOptions && detectedPlatform && (
        <Fade in timeout={800}>
          <Paper sx={{ 
            p: 4, 
            bgcolor: '#1A1A1A', 
            border: '1px solid #333', 
            borderRadius: 4,
            maxWidth: sidebarOpen ? 600 : 900,
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            transition: 'max-width 0.3s ease',
          }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
              Download Options
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={audioOnly}
                      onChange={(e) => setAudioOnly(e.target.checked)}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#667eea',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          bgcolor: '#667eea'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontSize: '1.1rem' }}>
                      Audio only
                    </Typography>
                  }
                />
              </Grid>

              {!audioOnly && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#999' }}>Video Quality</InputLabel>
                    <Select
                      value={quality}
                      label="Video Quality"
                      onChange={(e) => setQuality(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#667eea' },
                      }}
                    >
                      {videoQualities.map((quality) => (
                        <MenuItem key={quality.value} value={quality.value}>
                          {quality.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {downloadMutation.isError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Download failed. Please check the URL and try again.
              </Alert>
            )}
          </Paper>
        </Fade>
      )}

      {/* Footer */}
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#1a1a1a', mb: 2, fontWeight: 600 }}>
          Share Media Downloader
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', maxWidth: 600, mx: 'auto' }}>
          Join thousands of happy creators who trust our Media Downloader by sharing it on your favorite social media platforms.
        </Typography>
      </Box>
    </Box>
  )
}

export default DownloadPage
