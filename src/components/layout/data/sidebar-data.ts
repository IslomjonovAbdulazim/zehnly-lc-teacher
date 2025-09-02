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
      name: 'Teacher Portal',
      logo: GraduationCap,
      plan: 'Learning Center',
    },
  ],
  navGroups: [
    {
      title: 'Teaching',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Groups',
          url: '/groups',
          icon: Users,
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'Struggling Students',
          url: '/struggling',
          icon: TrendingDown,
        },
      ],
    },
    {
      title: 'Settings',
      items: [
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
