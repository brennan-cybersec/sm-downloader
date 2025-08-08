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
} from '@mui/material'
import { useQuery } from 'react-query'
import { getDownloadHistory } from '../services/api'
import { getPlatformColor, formatDuration } from '../utils/helpers'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import ScheduleIcon from '@mui/icons-material/Schedule'
import GetAppIcon from '@mui/icons-material/GetApp'

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
      <Box>
        <Typography variant="h4" gutterBottom>
          Download History
        </Typography>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Download History
        </Typography>
        <Typography color="error">
          Failed to load download history
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Download History
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {!history?.downloads || history.downloads.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No downloads yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start downloading content to see your history here
              </Typography>
            </Paper>
          ) : (
            <List>
              {history.downloads.map((download: DownloadItem, index: number) => (
                <React.Fragment key={download.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getStatusIcon(download.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" noWrap sx={{ flex: 1 }}>
                            {download.file_info?.title || 'Unknown Title'}
                          </Typography>
                          <Chip
                            label={download.platform}
                            size="small"
                            sx={{ backgroundColor: getPlatformColor(download.platform), color: 'white' }}
                          />
                          <Chip
                            label={download.status}
                            size="small"
                            color={getStatusColor(download.status) as any}
                            variant="outlined"
                          />
                          {download.status === 'completed' && (
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadFile(download.id, download.file_info?.title)}
                              color="primary"
                              title="Download file"
                            >
                              <GetAppIcon />
                            </IconButton>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {download.url}
                          </Typography>
                          {download.file_info && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Uploader: {download.file_info.uploader}
                              </Typography>
                              {download.file_info.duration && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                  Duration: {formatDuration(download.file_info.duration)}
                                </Typography>
                              )}
                              {download.file_info.view_count && (
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                  Views: {download.file_info.view_count.toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          )}
                          {download.status === 'downloading' && download.progress !== undefined && (
                            <Box sx={{ mt: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={download.progress}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {download.progress.toFixed(1)}% complete
                              </Typography>
                            </Box>
                          )}
                          {download.message && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                              {download.message}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < history.downloads.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Downloads
                </Typography>
                <Typography variant="h4">
                  {history?.total || 0}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Completed
                </Typography>
                <Typography variant="h6" color="success.main">
                  {history?.downloads?.filter((d: DownloadItem) => d.status === 'completed').length || 0}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Failed
                </Typography>
                <Typography variant="h6" color="error.main">
                  {history?.downloads?.filter((d: DownloadItem) => d.status === 'failed').length || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HistoryPage
