import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const CENTER_ID = 'center_id_cookie'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
  full_name?: string
  center_id?: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    centerId: number | null
    setCenterId: (centerId: number) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const centerIdState = getCookie(CENTER_ID)
  const initCenterId = centerIdState ? JSON.parse(centerIdState) : null
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      centerId: initCenterId,
      setCenterId: (centerId) =>
        set((state) => {
          setCookie(CENTER_ID, JSON.stringify(centerId))
          return { ...state, auth: { ...state.auth, centerId } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(CENTER_ID)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', centerId: null },
          }
        }),
    },
  }
})
