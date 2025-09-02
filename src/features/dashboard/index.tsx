import { useEffect, useState } from 'react'
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'

interface DashboardData {
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

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockData: DashboardData = {
      teacher: {
        id: 4,
        full_name: "Jane Smith"
      },
      stats: {
        assigned_groups: 3,
        total_students: 45
      },
      groups: [
        {
          id: 1,
          name: "Beginner English A1",
          course_id: 1,
          created_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Intermediate English B1", 
          course_id: 2,
          created_at: "2024-01-16T09:00:00Z"
        }
      ],
      recent_activity: [
        {
          lesson_id: 5,
          percentage: 85,
          completed: true,
          last_practiced: "2024-01-20T14:30:00Z"
        }
      ]
    }
    
    setTimeout(() => {
      setDashboardData(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading || !dashboardData) {
    return (
      <>
        <Header>
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ConfigDrawer />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-200 rounded w-1/4'></div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-32 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Xush kelibsiz, {dashboardData.teacher.full_name}</h1>
          <p className='text-muted-foreground'>Bu yerda o`qitish paneli ko`rinishi</p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tayinlangan Guruhlar</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{dashboardData.stats.assigned_groups}</div>
              <p className='text-xs text-muted-foreground'>Faol o'quv guruhlari</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Jami Talabalar</CardTitle>
              <BookOpen className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{dashboardData.stats.total_students}</div>
              <p className='text-xs text-muted-foreground'>Barcha guruhlardagi talabalar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>So'nggi Faoliyat</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{dashboardData.recent_activity.length}</div>
              <p className='text-xs text-muted-foreground'>Bugun tugallangan darslar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>O'rtacha Ball</CardTitle>
              <Award className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {dashboardData.recent_activity.length > 0 
                  ? `${Math.round(dashboardData.recent_activity.reduce((acc, curr) => acc + curr.percentage, 0) / dashboardData.recent_activity.length)}%`
                  : 'N/A'
                }
              </div>
              <p className='text-xs text-muted-foreground'>So'nggi dars natijalari</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Sizning Guruhlaringiz</CardTitle>
              <CardDescription>Tayinlangan o'quv guruhlarini boshqarish</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {dashboardData.groups.map((group) => (
                <div key={group.id} className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <h3 className='font-medium'>{group.name}</h3>
                    <p className='text-sm text-muted-foreground'>
                      Yaratilgan {new Date(group.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Users className='h-5 w-5 text-muted-foreground' />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>So'nggi Faoliyat</CardTitle>
              <CardDescription>Talabalarning so'nggi muvaffaqiyatlari</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {dashboardData.recent_activity.map((activity, index) => (
                <div key={index} className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <h3 className='font-medium'>{activity.lesson_id}-dars</h3>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(activity.last_practiced).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <div className='font-bold text-lg'>{activity.percentage}%</div>
                    <div className={`text-xs ${activity.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {activity.completed ? 'Tugallangan' : 'Jarayonda'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

