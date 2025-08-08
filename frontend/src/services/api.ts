import axios from 'axios'

const API_BASE_URL = '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export interface DownloadRequest {
  url: string
  quality?: string
  platform?: string
  audio_only?: boolean
}

export interface DownloadResponse {
  id: string
  url: string
  platform: string
  status: string
  progress?: number
  message?: string
}

export const downloadContent = async (request: DownloadRequest): Promise<DownloadResponse> => {
  const response = await api.post('/download', request)
  return response.data
}

export const getDownloadStatus = async (downloadId: string): Promise<any> => {
  const response = await api.get(`/download/${downloadId}`)
  return response.data
}

export const getDownloadHistory = async (): Promise<any> => {
  const response = await api.get('/downloads')
  return response.data
}

export const getSupportedPlatforms = async (): Promise<any> => {
  const response = await api.get('/platforms')
  return response.data
}

export default api
