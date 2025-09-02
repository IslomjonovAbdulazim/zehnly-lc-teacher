import {
  LayoutDashboard,
  Users,
  BarChart3,
  GraduationCap,
  TrendingDown,
  Settings,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Teacher',
    email: 'teacher@example.com',
    avatar: '/avatars/teacher.jpg',
  },
  teams: [
    {
      name: 'Zehnly Teacher',
      logo: GraduationCap,
      plan: 'O\'quv Markazi',
    },
  ],
  navGroups: [
    {
      title: 'O\'qitish',
      items: [
        {
          title: 'Boshqaruv Paneli',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Guruhlar',
          url: '/groups',
          icon: Users,
        },
        {
          title: 'Analitika',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'Qiynalayotgan Talabalar',
          url: '/struggling',
          icon: TrendingDown,
        },
      ],
    },
    {
      title: 'Sozlamalar',
      items: [
        {
          title: 'Sozlamalar',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
