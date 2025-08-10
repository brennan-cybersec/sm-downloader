import React from 'react'
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Fab,
} from '@mui/material'
import { useQuery } from 'react-query'
import { getDownloadHistory } from '../services/api'
import { getPlatformColor, formatDuration } from '../utils/helpers'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ScheduleIcon from '@mui/icons-material/Schedule'
import GetAppIcon from '@mui/icons-material/GetApp'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface DownloadItem {
  id: string
  url: string
  platform: string
  status: string
  progress?: number
  message?: string
  file_info?: {
    title?: string
    duration?: number
    uploader?: string
    view_count?: number
    like_count?: number
  }
}

interface DownloadHistory {
  downloads: DownloadItem[]
  total: number
}

// Platform data with colors and gradients
const platforms = [
  {
    name: 'tiktok',
    label: 'TikTok',
    color: '#FF0050',
    gradient: 'linear-gradient(135deg, #FF0050 0%, #FF6B9D 100%)',
  },
  {
    name: 'instagram',
    label: 'Instagram',
    color: '#E4405F',
    gradient: 'linear-gradient(135deg, #E4405F 0%, #F77737 100%)',
  },
  {
    name: 'twitter',
    label: 'X (Twitter)',
    color: '#1DA1F2',
    gradient: 'linear-gradient(135deg, #1DA1F2 0%, #0D8BD9 100%)',
  },
  {
    name: 'snapchat',
    label: 'Snapchat',
    color: '#FFFC00',
    gradient: 'linear-gradient(135deg, #FFFC00 0%, #FFD700 100%)',
  },
  {
    name: 'youtube',
    label: 'YouTube',
    color: '#FF0000',
    gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
  },
  {
    name: 'facebook',
    label: 'Facebook',
    color: '#1877F2',
    gradient: 'linear-gradient(135deg, #1877F2 0%, #0D6EFD 100%)',
  }
]

const HistoryPage: React.FC = () => {
  const { data: history, isLoading, error } = useQuery<DownloadHistory>('downloadHistory', getDownloadHistory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon color="success" />
      case 'failed':
        return <ErrorIcon color="error" />
      case 'downloading':
        return <DownloadIcon color="primary" />
      default:
        return <ScheduleIcon color="action" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'failed':
        return 'error'
      case 'downloading':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getPlatformData = (platformName: string) => {
    return platforms.find(p => p.name === platformName) || platforms[0]
  }

  const handleDownloadFile = (downloadId: string, title?: string) => {
    const filename = title || `download-${downloadId}`
    const url = `/api/v1/files/${downloadId}`
    
    // Create a temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#1A1A1A', color: 'white' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Download History
        </Typography>
        <LinearProgress sx={{ bgcolor: '#333', '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50' } }} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#1A1A1A', color: 'white' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
          Download History
        </Typography>
        <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3 }}>
          <Typography variant="body1" sx={{ color: '#999' }}>
            Error loading download history. Please try again.
          </Typography>
        </Paper>
      </Box>
    )
  }

  const completedDownloads = history?.downloads?.filter((d: DownloadItem) => d.status === 'completed') || []
  const failedDownloads = history?.downloads?.filter((d: DownloadItem) => d.status === 'failed') || []
  const downloadingDownloads = history?.downloads?.filter((d: DownloadItem) => d.status === 'downloading') || []

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#1A1A1A', color: 'white' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Download History
        </Typography>
        <Typography variant="body1" sx={{ color: '#999' }}>
          Your downloaded content and download history
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
              {history?.total || 0}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Total Downloads
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 1 }}>
              {completedDownloads.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Completed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: '#f44336', fontWeight: 'bold', mb: 1 }}>
              {failedDownloads.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Failed
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ color: '#2196F3', fontWeight: 'bold', mb: 1 }}>
              {downloadingDownloads.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              In Progress
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Download History Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            Recent Downloads
          </Typography>
          
          {history?.downloads && history.downloads.length > 0 ? (
            <Grid container spacing={3}>
              {history.downloads.map((download) => {
                const platformData = getPlatformData(download.platform)
                const title = download.file_info?.title || `Download ${download.id.slice(0, 8)}`
                const uploader = download.file_info?.uploader || download.platform
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={download.id}>
                    <Card
                      sx={{
                        bgcolor: '#2C2C2C',
                        border: '1px solid #333',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          borderColor: platformData.color,
                        },
                      }}
                    >
                      {/* Platform Background */}
                      <Box
                        sx={{
                          height: 200,
                          background: platformData.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            textAlign: 'center',
                            px: 2,
                          }}
                        >
                          {platformData.label}
                        </Typography>
                        
                        {/* Status Icon */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            width: 32,
                            height: 32,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid white',
                          }}
                        >
                          {getStatusIcon(download.status)}
                        </Box>

                        {/* Play/Download Button Overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid white',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'rgba(0,0,0,0.9)',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (download.status === 'completed') {
                              handleDownloadFile(download.id, download.file_info?.title)
                            }
                          }}
                        >
                          {download.status === 'completed' ? (
                            <GetAppIcon sx={{ color: 'white', fontSize: 20 }} />
                          ) : (
                            <PlayArrowIcon sx={{ color: 'white', fontSize: 20 }} />
                          )}
                        </Box>

                        {/* Progress Bar for Downloading */}
                        {download.status === 'downloading' && download.progress !== undefined && (
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 4,
                              bgcolor: 'rgba(0,0,0,0.5)',
                            }}
                          >
                            <LinearProgress
                              variant="determinate"
                              value={download.progress}
                              sx={{
                                height: '100%',
                                '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50' }
                              }}
                            />
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ p: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: 'white', 
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#999', 
                            fontSize: '0.875rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {uploader}
                        </Typography>
                        
                        {/* Status Chip */}
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={download.status}
                            size="small"
                            color={getStatusColor(download.status) as any}
                            sx={{
                              bgcolor: download.status === 'completed' ? '#4CAF50' : 
                                      download.status === 'failed' ? '#f44336' : '#2196F3',
                              color: 'white',
                              '& .MuiChip-label': { color: 'white' }
                            }}
                          />
                        </Box>

                        {/* Additional Info */}
                        {download.file_info?.duration && (
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', mt: 1 }}>
                            Duration: {formatDuration(download.file_info.duration)}
                          </Typography>
                        )}
                        
                        {download.message && (
                          <Typography variant="caption" sx={{ color: '#f44336', display: 'block', mt: 1 }}>
                            {download.message}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                No downloads yet
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                Start downloading content to see your history here
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: '#4CAF50',
                  '&:hover': { bgcolor: '#45a049' },
                }}
              >
                Start Downloading
              </Button>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, bgcolor: '#2C2C2C', border: '1px solid #333', borderRadius: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Quick Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<DownloadIcon />}
                sx={{
                  color: 'white',
                  borderColor: '#444',
                  '&:hover': { borderColor: '#4CAF50', bgcolor: 'rgba(76, 175, 80, 0.1)' }
                }}
              >
                New Download
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<GetAppIcon />}
                sx={{
                  color: 'white',
                  borderColor: '#444',
                  '&:hover': { borderColor: '#4CAF50', bgcolor: 'rgba(76, 175, 80, 0.1)' }
                }}
              >
                Download All
              </Button>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#333' }} />

            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Platform Stats
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {platforms.map((platform) => {
                const platformDownloads = history?.downloads?.filter((d: DownloadItem) => d.platform === platform.name) || []
                return (
                  <Box key={platform.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: platform.gradient,
                        }}
                      />
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {platform.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {platformDownloads.length}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#4CAF50',
          '&:hover': { bgcolor: '#45a049' },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  )
}

export default HistoryPage
