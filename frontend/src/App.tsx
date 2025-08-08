import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Box } from '@mui/material'
import Header from './components/Header'
import DownloadPage from './pages/DownloadPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<DownloadPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
