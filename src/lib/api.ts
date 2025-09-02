import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const BASE_URL = 'https://edutizimbackend-production.up.railway.app/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const { auth } = useAuthStore.getState()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { auth } = useAuthStore.getState()
      auth.reset()
    }
    return Promise.reject(error)
  }
)

export interface ApiResponse<T> {
  success: boolean
  data: T
  detail?: string
}

export interface DashboardData {
  teacher: {
    id: number
    full_name: string
  }
  stats: {
    assigned_groups: number
    total_students: number
  }
  groups: Array<{
    id: number
    name: string
    course_id: number
    created_at: string
  }>
  recent_activity: Array<{
    lesson_id: number
    percentage: number
    completed: boolean
    last_practiced: string
  }>
}

export interface Group {
  id: number
  name: string
  course_id: number
  student_count: number
  created_at: string
}

export interface Student {
  profile: {
    id: number
    full_name: string
    created_at: string
  }
  progress: {
    completed_lessons: number
    total_lessons: number
    average_percentage: number
    total_coins: number
    total_points: number
  }
  rank: number
}

export interface GroupDetail {
  group: {
    id: number
    name: string
    course_id: number
  }
  students: Student[]
}

export interface LeaderboardEntry {
  rank: number
  profile_id: number
  full_name: string
  total_coins: number
  avatar: string | null
}

export interface LeaderboardData {
  group: {
    id: number
    name: string
  }
  leaderboard: LeaderboardEntry[]
}

export interface StudentProgress {
  student: {
    id: number
    full_name: string
    created_at: string
  }
  progress: Array<{
    lesson_id: number
    percentage: number
    completed: boolean
    last_practiced: string
  }>
  weak_words: Array<{
    word_id: number
    word: string
    meaning: string
    last_seven_attempts: string
    total_correct: number
    total_attempts: number
  }>
  recent_activity: Array<{
    amount: number
    source: string
    earned_at: string
  }>
}

export interface StrugglingStudent {
  student: {
    id: number
    full_name: string
  }
  reason: string
  avg_percentage: number
}

export interface AnalyticsData {
  total_groups: number
  total_students: number
  active_students: number
  avg_completion_rate: number
  completed_lessons: number
  total_lessons: number
}

export interface WeeklyReport {
  week_summary: {
    total_progress_records: number
    daily_breakdown: Array<{
      date: string
      lessons_completed: number
      active_students: number
    }>
  }
}

export const teacherApi = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get<ApiResponse<DashboardData>>('/teacher/dashboard')
    return response.data.data
  },

  getGroups: async (): Promise<Group[]> => {
    const response = await api.get<ApiResponse<Group[]>>('/teacher/groups')
    return response.data.data
  },

  getGroupStudents: async (groupId: number): Promise<GroupDetail> => {
    const response = await api.get<ApiResponse<GroupDetail>>(`/teacher/groups/${groupId}/students`)
    return response.data.data
  },

  getGroupLeaderboard: async (groupId: number): Promise<LeaderboardData> => {
    const response = await api.get<ApiResponse<LeaderboardData>>(`/teacher/groups/${groupId}/leaderboard`)
    return response.data.data
  },

  getStudentProgress: async (studentId: number): Promise<StudentProgress> => {
    const response = await api.get<ApiResponse<StudentProgress>>(`/teacher/students/${studentId}/progress`)
    return response.data.data
  },

  getStrugglingStudents: async (): Promise<StrugglingStudent[]> => {
    const response = await api.get<ApiResponse<StrugglingStudent[]>>('/teacher/students/struggling')
    return response.data.data
  },

  getAnalyticsOverview: async (): Promise<AnalyticsData> => {
    const response = await api.get<ApiResponse<AnalyticsData>>('/teacher/analytics/overview')
    return response.data.data
  },

  getWeeklyReport: async (): Promise<WeeklyReport> => {
    const response = await api.get<ApiResponse<WeeklyReport>>('/teacher/reports/weekly')
    return response.data.data
  },

  changePassword: async (data: {
    current_password: string
    new_password: string
    confirm_password: string
  }): Promise<{ message: string }> => {
    const response = await api.patch<ApiResponse<{ message: string }>>('/teacher/password', data)
    return response.data.data
  },
}

export default api