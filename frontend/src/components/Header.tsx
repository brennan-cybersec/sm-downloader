import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { Download, History } from '@mui/icons-material'

const Header: React.FC = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Download', icon: <Download /> },
    { path: '/history', label: 'History', icon: <History /> },
  ]

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          Social Media Downloader
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={RouterLink}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: 'white',
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
