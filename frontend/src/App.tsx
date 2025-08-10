import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  AppBar, 
  Toolbar, 
  IconButton,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  CircularProgress
} from '@mui/material'
import { 
  Download, 
  History, 
  Menu, 
  Person, 
  Notifications, 
  Search,
  Settings,
  DarkMode,
  Apple,
  ArrowForward,
  ShoppingCart,
  Instagram,
  ContactSupport,
  Security,
  Description
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import DownloadPage from './pages/DownloadPage'
import HistoryPage from './pages/HistoryPage'
import AuthPage from './pages/auth/AuthPage'
import ProfileManager from './components/auth/ProfileManager'
import { useAuth } from './contexts/AuthContext'

const drawerWidth = 280

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [darkMode, setDarkMode] = React.useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { user, isAuthenticated, isLoading } = useAuth()

  const menuItems = [
    { text: 'Download', icon: <Download />, path: '/' },
    { text: 'History', icon: <History />, path: '/history' },
    ...(user ? [{ text: 'Profile', icon: <Person />, path: '/profile' }] : []),
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#1A1A1A', color: 'white' }}>
      {/* Profile Section */}
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #333' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            bgcolor: '#2C2C2C',
            border: '2px solid #4CAF50',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 40,
              height: 40,
              background: 'radial-gradient(circle, #4CAF50 0%, #2E7D32 100%)',
              borderRadius: '50%',
            }
          }}
        >
          {user ? user.username.charAt(0).toUpperCase() : <Download sx={{ fontSize: 30, color: 'white' }} />}
        </Avatar>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
          {user ? user.username : 'Guest'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
          {user ? `Joined ${user.joinDate}` : 'Not signed in'}
        </Typography>
        {user ? (
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/profile')}
            sx={{ 
              color: '#4CAF50', 
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' }
            }}
          >
            Edit profile
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate('/auth')}
            sx={{ 
              bgcolor: '#4CAF50',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#2E7D32' }
            }}
          >
            Sign In
          </Button>
        )}
      </Box>

      {/* Download App Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<Apple />}
          sx={{
            color: 'white',
            borderColor: '#444',
            '&:hover': { borderColor: '#4CAF50', bgcolor: 'rgba(76, 175, 80, 0.1)' }
          }}
        >
          Download iOS App
        </Button>
      </Box>

      {/* Subscription Section */}
      {user && (
        <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Subscription
            </Typography>
            <Typography variant="body2" sx={{ color: '#4CAF50' }}>
              {user.subscription === 'premium' ? 'Premium' : 'Free plan'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Box sx={{ flex: 1, height: 4, bgcolor: '#333', borderRadius: 2, overflow: 'hidden' }}>
              <Box 
                sx={{ 
                  width: `${(user.downloadsUsed / user.downloadsLimit) * 100}%`, 
                  height: '100%', 
                  bgcolor: user.subscription === 'premium' ? '#4CAF50' : 'white' 
                }} 
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#999' }}>
              {user.downloadsUsed} of {user.downloadsLimit}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#999' }}>
            downloads used
          </Typography>
        </Box>
      )}

      {/* Try Membership Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
          Try [membership]
        </Typography>
        <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
          Unlock unlimited downloads and premium features
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: 'white',
            color: 'black',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          Subscribe now
        </Button>
      </Box>

      {/* Dark Mode Toggle */}
      <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#4CAF50',
                  '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.1)' }
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  bgcolor: '#4CAF50'
                }
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DarkMode sx={{ fontSize: 20, color: 'white' }} />
              <Typography sx={{ color: 'white' }}>Dark mode</Typography>
            </Box>
          }
          sx={{ m: 0 }}
        />
      </Box>

      {/* Navigation Links */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => {
              navigate(item.path)
              setMobileOpen(false)
            }}
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              bgcolor: location.pathname === item.path ? '#2C2C2C' : 'transparent',
              color: location.pathname === item.path ? 'white' : '#999',
              '&:hover': {
                bgcolor: '#2C2C2C',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      {/* Additional Links */}
      <List sx={{ mt: 'auto', pb: 2 }}>
        {[
          { text: '[shop]', icon: <ShoppingCart /> },
          { text: '[untitled] on Instagram', icon: <Instagram /> },
          { text: 'Contact us', icon: <ContactSupport /> },
          { text: 'Trust and Security', icon: <Security /> },
          { text: 'Terms of Use', icon: <Description /> },
        ].map((item) => (
          <ListItem
            key={item.text}
            button
            sx={{
              mx: 1,
              mb: 0.5,
              borderRadius: 2,
              color: '#999',
              '&:hover': {
                bgcolor: '#2C2C2C',
                color: 'white',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            <ArrowForward sx={{ fontSize: 16, color: 'inherit' }} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        bgcolor: '#1A1A1A' 
      }}>
        <CircularProgress size={60} sx={{ color: '#4CAF50' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#1A1A1A' }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#2C2C2C',
          borderBottom: '1px solid #333',
          display: { xs: 'block', sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'white' }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
            [untitled]
          </Typography>
          <IconButton sx={{ color: 'white' }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Notifications />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Person />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Desktop Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarCollapsed ? '100%' : `calc(100% - ${drawerWidth}px)` },
          ml: { sm: sidebarCollapsed ? 0 : `${drawerWidth}px` },
          bgcolor: '#2C2C2C',
          borderBottom: '1px solid #333',
          display: { xs: 'none', sm: 'block' },
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar>
          <IconButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{ color: 'white', mr: 2 }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
            [untitled]
          </Typography>
          <IconButton sx={{ color: 'white' }}>
            <Search />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Notifications />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <Person />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: sidebarCollapsed ? 0 : drawerWidth }, 
          flexShrink: { sm: 0 },
          transition: 'width 0.3s ease',
          overflow: 'hidden',
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#1A1A1A' },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarCollapsed ? 0 : drawerWidth, 
              bgcolor: '#1A1A1A',
              transition: 'width 0.3s ease',
              overflow: sidebarCollapsed ? 'hidden' : 'auto',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: sidebarCollapsed ? '100%' : `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 8 },
          transition: 'all 0.3s ease',
        }}
      >
        <Routes>
          <Route path="/" element={<DownloadPage sidebarOpen={!sidebarCollapsed} />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfileManager />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
