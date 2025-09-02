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
import { teacherApi, type DashboardData } from '@/lib/api'
import { toast } from 'sonner'

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const data = await teacherApi.getDashboard()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        toast.error('Dashboard ma\'lumotlarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
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

