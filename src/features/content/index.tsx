import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Eye, Calendar, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { contentApi, type Course } from '@/lib/api'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

export function Content() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        console.log('Starting to load courses...')
        
        const centerId = auth.centerId
        if (!centerId) {
          throw new Error('Center ID not found in user data')
        }
        
        const data = await contentApi.getCourses(centerId)
        console.log('Loaded courses:', data)
        setCourses(data)
      } catch (error: any) {
        console.error('Failed to load courses:', error)
        console.log('Error response:', error.response?.data)
        const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Kurslarni yuklashda xatolik yuz berdi'
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [auth.centerId])

  const handleViewCourse = (courseId: number) => {
    navigate({ to: `/content/courses/${courseId}` })
  }

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
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-48 bg-gray-200 rounded'></div>
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
          <h1 className='text-3xl font-bold tracking-tight flex items-center'>
            <BookOpen className='h-8 w-8 mr-3' />
            Kurs Kontenti
          </h1>
          <p className='text-muted-foreground'>O'quv markazidagi barcha kurslar va ularning tarkibi</p>
        </div>

        <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
          {courses.map((course) => (
            <Card key={course.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{course.title}</CardTitle>
                  <Badge variant='secondary'>
                    #{course.id}
                  </Badge>
                </div>
                <CardDescription className='line-clamp-2'>
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>
                    Yaratilgan {new Date(course.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleViewCourse(course.id)}
                  className='w-full'
                  size='sm'
                >
                  <Eye className='h-4 w-4 mr-2' />
                  Modullar va Darslarni Ko'rish
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && !loading && (
          <Card className='text-center py-12'>
            <CardContent>
              <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Kurs Topilmadi</h3>
              <p className='text-muted-foreground'>Ushbu o'quv markazi uchun hali kurslar mavjud emas.</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}