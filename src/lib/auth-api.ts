import axios from 'axios'

const BASE_URL = 'https://edutizimbackend-production.up.railway.app/api'

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
  center_id: number
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await authApi.post<LoginResponse>('/auth/login', credentials)
  return response.data
}

export default authApi