import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, TrendingDown, Calendar, Target } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { teacherApi, type StudentProgress } from '@/lib/api'
import { toast } from 'sonner'

export function StudentProgress() {
  const { studentId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [studentData, setStudentData] = useState<StudentProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudentProgress = async () => {
      if (!studentId) return
      
      try {
        setLoading(true)
        const data = await teacherApi.getStudentProgress(parseInt(studentId))
        setStudentData(data)
      } catch (error) {
        console.error('Failed to load student progress:', error)
        toast.error('Talaba muvaffaqiyati ma\'lumotini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadStudentProgress()
  }, [studentId])

  const getAccuracyRate = (correct: number, total: number) => {
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  const getAttemptsVisual = (attempts: string) => {
    return attempts.split('').map((attempt, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full ${
          attempt === '1' ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    ))
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
            <div className='h-8 bg-gray-200 rounded w-1/3'></div>
            <div className='grid gap-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-32 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (!studentData) return null

  return (
    <>
      <Header>
        <Button 
          variant='ghost' 
          size='sm'
          onClick={() => navigate({ to: '/groups' })}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Guruhlarga Qaytish
        </Button>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 space-y-4'>
          <div className='flex items-center space-x-4'>
            <Avatar className='h-16 w-16'>
              <AvatarFallback className='text-lg'>
                {studentData.student.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>{studentData.student.full_name}</h1>
              <p className='text-muted-foreground'>
                Talaba bo'lgan vaqt {new Date(studentData.student.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-3 mb-6'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Dars Muvaffaqiyati</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold mb-2'>
                {studentData.progress.filter(p => p.completed).length} / {studentData.progress.length}
              </div>
              <p className='text-xs text-muted-foreground'>Tugallangan darslar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>O'rtacha Ball</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold mb-2'>
                {Math.round(studentData.progress.reduce((acc, curr) => acc + curr.percentage, 0) / studentData.progress.length)}%
              </div>
              <p className='text-xs text-muted-foreground'>Barcha darslar bo'yicha</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium'>Zaif So'zlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold mb-2'>{studentData.weak_words.length}</div>
              <p className='text-xs text-muted-foreground'>Diqqat talab qiladi</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <BookOpen className='h-5 w-5 mr-2' />
                Dars Muvaffaqiyati
              </CardTitle>
              <CardDescription>Har bir dars bo'yicha natijalar</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {studentData.progress.map((lesson) => (
                <div key={lesson.lesson_id} className='flex items-center justify-between p-4 border rounded-lg'>
                  <div>
                    <h4 className='font-medium'>{lesson.lesson_id}-dars</h4>
                    <p className='text-sm text-muted-foreground'>
                      So'nggi mashq: {new Date(lesson.last_practiced).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right space-y-1'>
                    <div className='text-lg font-bold'>{lesson.percentage}%</div>
                    <Badge variant={lesson.completed ? 'default' : 'secondary'}>
                      {lesson.completed ? 'Tugallangan' : 'Jarayonda'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <TrendingDown className='h-5 w-5 mr-2 text-red-500' />
                Zaif So'zlar
              </CardTitle>
              <CardDescription>Ko'proq mashq talab qiladigan so'zlar</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {studentData.weak_words.map((word) => (
                <div key={word.word_id} className='p-4 border rounded-lg space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium'>{word.word}</h4>
                      <p className='text-sm text-muted-foreground'>{word.meaning}</p>
                    </div>
                    <Badge variant='outline'>
                      {getAccuracyRate(word.total_correct, word.total_attempts)}% aniqlik
                    </Badge>
                  </div>
                  
                  <div className='space-y-2'>
                    <p className='text-xs text-muted-foreground'>So'nggi 7 ta urinish:</p>
                    <div className='flex space-x-1'>
                      {getAttemptsVisual(word.last_seven_attempts)}
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {word.total_attempts} urinishdan {word.total_correct} ta to'g'ri
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className='mt-6'>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Calendar className='h-5 w-5 mr-2' />
              So'nggi Faoliyat
            </CardTitle>
            <CardDescription>Turli faoliyatlardan olingan ballar</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            {studentData.recent_activity.map((activity, index) => (
              <div key={index} className='flex items-center justify-between p-3 border rounded-lg'>
                <div className='flex items-center space-x-3'>
                  <Target className='h-4 w-4 text-muted-foreground' />
                  <div>
                    <p className='font-medium capitalize'>{activity.source}</p>
                    <p className='text-sm text-muted-foreground'>
                      {new Date(activity.earned_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant='outline'>+{activity.amount} ball</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </Main>
    </>
  )
}