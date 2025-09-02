import { useEffect, useState } from 'react'
import { BarChart3, Users, BookOpen, TrendingUp, Calendar } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { teacherApi, type AnalyticsData, type WeeklyReport } from '@/lib/api'
import { toast } from 'sonner'

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true)
        const [analytics, weekly] = await Promise.all([
          teacherApi.getAnalyticsOverview(),
          teacherApi.getWeeklyReport()
        ])
        setAnalyticsData(analytics)
        setWeeklyReport(weekly)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
        toast.error('Analitika ma\'lumotlarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [])

  if (loading) {
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

  if (!analyticsData || !weeklyReport) return null

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
          <h1 className='text-3xl font-bold tracking-tight flex items-center'>
            <BarChart3 className='h-8 w-8 mr-3' />
            Analitika Ko'rinishi
          </h1>
          <p className='text-muted-foreground'>Barcha tayinlangan guruhlar uchun samaradorlik ko`rsatkichlari</p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Jami Guruhlar</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{analyticsData.total_groups}</div>
              <p className='text-xs text-muted-foreground'>Sizga tayinlangan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Faol Talabalar</CardTitle>
              <TrendingUp className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{analyticsData.active_students}</div>
              <p className='text-xs text-muted-foreground'>
                {analyticsData.total_students} talabadan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tugallash Darajasi</CardTitle>
              <BookOpen className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{analyticsData.avg_completion_rate}%</div>
              <p className='text-xs text-muted-foreground'>Barcha guruhlar bo'yicha o'rtacha</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Tugallangan Darslar</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{analyticsData.completed_lessons}</div>
              <p className='text-xs text-muted-foreground'>
                {analyticsData.total_lessons} darsdan
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Haftalik Faoliyat Hisoboti</CardTitle>
              <CardDescription>Talabalar faolligining kunlik taqsimoti</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-muted rounded-lg'>
                <span className='font-medium'>Jami Muvaffaqiyat Yozuvlari</span>
                <Badge variant='secondary'>{weeklyReport.week_summary.total_progress_records}</Badge>
              </div>
              
              {weeklyReport.week_summary.daily_breakdown.map((day, index) => (
                <div key={index} className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <h4 className='font-medium'>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                    <p className='text-sm text-muted-foreground'>{day.date}</p>
                  </div>
                  <div className='text-right space-y-1'>
                    <div className='flex items-center space-x-4'>
                      <div className='text-center'>
                        <div className='font-bold'>{day.lessons_completed}</div>
                        <div className='text-xs text-muted-foreground'>Darslar</div>
                      </div>
                      <div className='text-center'>
                        <div className='font-bold'>{day.active_students}</div>
                        <div className='text-xs text-muted-foreground'>Faol</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Samaradorlik Xulosasi</CardTitle>
              <CardDescription>Asosiy ko`rsatkichlar bir qarashda</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium'>Talabalar Faolligi</span>
                  <span className='text-sm'>{Math.round((analyticsData.active_students / analyticsData.total_students) * 100)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div 
                    className='bg-green-600 h-2 rounded-full transition-all'
                    style={{ width: `${(analyticsData.active_students / analyticsData.total_students) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium'>Umumiy Muvaffaqiyat</span>
                  <span className='text-sm'>{Math.round((analyticsData.completed_lessons / analyticsData.total_lessons) * 100)}%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div 
                    className='bg-blue-600 h-2 rounded-full transition-all'
                    style={{ width: `${(analyticsData.completed_lessons / analyticsData.total_lessons) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className='pt-4 space-y-2'>
                <h4 className='font-medium'>Shu Haftaning Asosiy Voqealari</h4>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Eng Yaxshi Kun:</span>
                    <span className='font-medium'>
                      {weeklyReport.week_summary.daily_breakdown.reduce((prev, current) => 
                        current.lessons_completed > prev.lessons_completed ? current : prev
                      ).date}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span>Eng Yuqori Faollik:</span>
                    <span className='font-medium'>
                      {Math.max(...weeklyReport.week_summary.daily_breakdown.map(d => d.active_students))} talaba
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}