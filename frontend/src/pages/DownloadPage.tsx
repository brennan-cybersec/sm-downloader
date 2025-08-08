import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material'
import { Download, Link, CheckCircle } from '@mui/icons-material'
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
  
  return null
}

const DownloadPage: React.FC = () => {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState('best')
  const [audioOnly, setAudioOnly] = useState(false)
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null)

  const downloadMutation = useMutation(downloadContent, {
    onSuccess: (data) => {
      console.log('Download started:', data)
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
    } else {
      setDetectedPlatform(null)
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

  const platforms = [
    { name: 'tiktok', label: 'TikTok', color: 'primary' as const },
    { name: 'instagram', label: 'Instagram', color: 'secondary' as const },
    { name: 'twitter', label: 'X (Twitter)', color: 'info' as const },
    { name: 'snapchat', label: 'Snapchat', color: 'success' as const },
  ]

  const videoQualities = [
    { value: 'best', label: 'Best Quality (Auto)' },
    { value: 'worst', label: 'Lowest Quality (Auto)' },
    { value: '4k', label: '4K (2160p)' },
    { value: '1440p', label: '2K (1440p)' },
    { value: '1080p', label: 'Full HD (1080p)' },
    { value: '720p', label: 'HD (720p)' },
    { value: '480p', label: 'SD (480p)' },
    { value: '360p', label: '360p' },
    { value: '240p', label: '240p' },
    { value: '180p', label: '180p' },
  ]

  const audioFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'm4a', label: 'M4A' },
    { value: 'opus', label: 'Opus' },
    { value: 'aac', label: 'AAC' },
  ]

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Download Content
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Enter URL
              </Typography>
              
              <TextField
                fullWidth
                label="Social Media URL"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/1234567890"
                variant="outlined"
                margin="normal"
                InputProps={{
                  startAdornment: <Link sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />

              {detectedPlatform && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Detected Platform:
                  </Typography>
                  <Chip
                    label={platforms.find(p => p.name === detectedPlatform)?.label || detectedPlatform}
                    color={platforms.find(p => p.name === detectedPlatform)?.color}
                    variant="outlined"
                  />
                </Box>
              )}

              <Box sx={{ mt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={audioOnly}
                      onChange={(e) => setAudioOnly(e.target.checked)}
                    />
                  }
                  label="Audio Only (Extract Music)"
                />
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {audioOnly ? (
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Audio Format</InputLabel>
                    <Select
                      value={quality}
                      label="Audio Format"
                      onChange={(e) => setQuality(e.target.value)}
                    >
                      {audioFormats.map((format) => (
                        <MenuItem key={format.value} value={format.value}>
                          {format.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Video Quality</InputLabel>
                    <Select
                      value={quality}
                      label="Video Quality"
                      onChange={(e) => setQuality(e.target.value)}
                    >
                      {videoQualities.map((quality) => (
                        <MenuItem key={quality.value} value={quality.value}>
                          {quality.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleDownload}
                  disabled={!url.trim() || downloadMutation.isLoading}
                  startIcon={
                    downloadMutation.isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Download />
                    )
                  }
                >
                  {downloadMutation.isLoading 
                    ? 'Starting Download...' 
                    : audioOnly 
                      ? 'Download Audio' 
                      : 'Download Video'
                  }
                </Button>
              </Box>

              {downloadMutation.isError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Download failed. Please check the URL and try again.
                </Alert>
              )}

              {downloadMutation.isSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Download started successfully!
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Supported Platforms
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {platforms.map((platform) => (
                <Box key={platform.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">
                    {platform.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Simply paste any supported social media URL and the platform will be automatically detected.
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Quality Options
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Video:</strong> 180p to 4K resolution
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Audio:</strong> MP3, M4A, Opus, AAC formats
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Auto:</strong> Best/worst quality detection
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DownloadPage
