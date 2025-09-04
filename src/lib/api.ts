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

export interface Course {
  id: number
  title: string
  description: string
  created_at: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  order_index: number
  word_count: number
}

export interface Module {
  id: number
  title: string
  description: string
  order_index: number
  lessons: Lesson[]
}

export interface CourseDetail {
  id: number
  title: string
  description: string
  modules: Module[]
}

export interface Word {
  id: number
  word: string
  meaning: string
  definition: string
  example_sentence: string
  image_url: string
  audio_url: string
  order_index: number
}

export interface StudentModules {
  student: {
    id: number
    full_name: string
    created_at: string
  }
  course: {
    id: number
    title: string
    description: string
    progress: {
      overall_percentage: number
      completed_lessons: number
      total_lessons: number
    }
  }
  modules: Array<{
    id: number
    title: string
    description: string
    order_index: number
    progress: {
      percentage: number
      completed_lessons: number
      total_lessons: number
    }
  }>
}

export interface ModuleLessons {
  module: {
    id: number
    title: string
    description: string
    order_index: number
  }
  lessons: Array<{
    id: number
    title: string
    description: string
    order_index: number
    progress: {
      percentage: number
      completed: boolean
      last_practiced: string
    }
    word_stats: {
      total_words: number
      weak_words_count: number
      practiced_words: number
    }
  }>
}

export interface LessonWords {
  lesson: {
    id: number
    title: string
    description: string
    order_index: number
    progress: {
      percentage: number
      completed: boolean
      last_practiced: string
    }
  }
  words: Array<{
    id: number
    word: string
    meaning: string
    definition: string
    example_sentence: string
    image_url: string
    audio_url: string
    order_index: number
    stats: {
      total_attempts: number
      total_correct: number
      accuracy_rate: number
      last_seven_attempts: string
      recent_accuracy: number
      last_practiced: string
      is_weak: boolean
    }
  }>
  summary: {
    total_words: number
    weak_words_count: number
    practiced_words: number
    mastered_words: number
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

  getStudentModules: async (studentId: number): Promise<StudentModules> => {
    const response = await api.get<ApiResponse<StudentModules>>(`/teacher/students/${studentId}/modules`)
    return response.data.data
  },

  getModuleLessons: async (studentId: number, moduleId: number): Promise<ModuleLessons> => {
    const response = await api.get<ApiResponse<ModuleLessons>>(`/teacher/students/${studentId}/modules/${moduleId}/lessons`)
    return response.data.data
  },

  getLessonWords: async (studentId: number, lessonId: number): Promise<LessonWords> => {
    const response = await api.get<ApiResponse<LessonWords>>(`/teacher/students/${studentId}/lessons/${lessonId}/words`)
    return response.data.data
  },
}

// Create separate API instance for content (no /api prefix)
const contentApiInstance = axios.create({
  baseURL: 'https://edutizimbackend-production.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
})

contentApiInstance.interceptors.request.use((config) => {
  const { auth } = useAuthStore.getState()
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

export const contentApi = {
  getCourses: async (centerId: number): Promise<Course[]> => {
    console.log('Fetching courses for center:', centerId)
    const url = `/api/content/courses?center_id=${centerId}`
    console.log('Full URL:', url)
    const response = await contentApiInstance.get<ApiResponse<Course[]>>(url)
    console.log('Courses response:', response.data)
    return response.data.data
  },

  getCourseDetail: async (courseId: number): Promise<CourseDetail> => {
    console.log('Fetching course detail for:', courseId)
    const response = await contentApiInstance.get<ApiResponse<CourseDetail>>(`/api/content/courses/${courseId}`)
    console.log('Course detail response:', response.data)
    return response.data.data
  },

  getLessonWords: async (lessonId: number): Promise<Word[]> => {
    console.log('Fetching lesson words for:', lessonId)
    const response = await contentApiInstance.get<ApiResponse<Word[]>>(`/api/content/lessons/${lessonId}/words`)
    console.log('Lesson words response:', response.data)
    return response.data.data
  },
}

export default api