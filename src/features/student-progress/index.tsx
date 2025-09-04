import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { teacherApi, type StudentModules, type ModuleLessons, type LessonWords } from '@/lib/api'
import { toast } from 'sonner'

export function StudentProgress() {
  const { studentId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [studentModules, setStudentModules] = useState<StudentModules | null>(null)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [moduleLessons, setModuleLessons] = useState<ModuleLessons | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null)
  const [lessonWords, setLessonWords] = useState<LessonWords | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudentModules = async () => {
      if (!studentId) return
      
      try {
        setLoading(true)
        const data = await teacherApi.getStudentModules(parseInt(studentId))
        setStudentModules(data)
      } catch (error) {
        console.error('Failed to load student modules:', error)
        toast.error('Talaba modullarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadStudentModules()
  }, [studentId])

  const handleModuleClick = async (moduleId: number) => {
    if (!studentId) return
    
    try {
      setSelectedModule(moduleId)
      setSelectedLesson(null)
      setLessonWords(null)
      const data = await teacherApi.getModuleLessons(parseInt(studentId), moduleId)
      setModuleLessons(data)
    } catch (error) {
      console.error('Failed to load module lessons:', error)
      toast.error('Modul darslarini yuklashda xatolik yuz berdi')
    }
  }

  const handleLessonClick = async (lessonId: number) => {
    if (!studentId) return
    
    try {
      setSelectedLesson(lessonId)
      const data = await teacherApi.getLessonWords(parseInt(studentId), lessonId)
      setLessonWords(data)
    } catch (error) {
      console.error('Failed to load lesson words:', error)
      toast.error('Dars so\'zlarini yuklashda xatolik yuz berdi')
    }
  }

  const handleBackClick = () => {
    if (selectedLesson) {
      setSelectedLesson(null)
      setLessonWords(null)
    } else if (selectedModule) {
      setSelectedModule(null)
      setModuleLessons(null)
    } else {
      navigate({ to: '/groups' })
    }
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

  if (!studentModules) return null

  return (
    <>
      <Header>
        <Button 
          variant='ghost' 
          size='sm'
          onClick={handleBackClick}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          {selectedLesson ? 'Darslarga Qaytish' : selectedModule ? 'Modullarga Qaytish' : 'Guruhlarga Qaytish'}
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
                {studentModules.student.full_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>{studentModules.student.full_name}</h1>
              <p className='text-muted-foreground'>
                {studentModules.course.title} - {studentModules.course.progress.overall_percentage}%
              </p>
            </div>
          </div>
        </div>

        {!selectedModule && (
          <div>
            <h2 className='text-lg font-semibold mb-2'>Modullar</h2>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
              {studentModules.modules.map((module) => (
                <Card key={module.id} className='cursor-pointer hover:bg-accent/50' onClick={() => handleModuleClick(module.id)}>
                  <CardContent className='px-3 py-0'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-sm'>{module.title}</span>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm'>{module.progress.percentage}%</span>
                        <ChevronRight className='h-4 w-4 text-muted-foreground' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedModule && moduleLessons && !selectedLesson && (
          <div>
            <h2 className='text-lg font-semibold mb-2'>{moduleLessons.module.title} - Darslar</h2>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
              {moduleLessons.lessons.map((lesson) => (
                <Card key={lesson.id} className='cursor-pointer hover:bg-accent/50' onClick={() => handleLessonClick(lesson.id)}>
                  <CardContent className='px-3 py-0'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-sm'>{lesson.title}</span>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm'>{lesson.progress.percentage}%</span>
                        <ChevronRight className='h-4 w-4 text-muted-foreground' />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {selectedLesson && lessonWords && (
          <div>
            <h2 className='text-lg font-semibold mb-2'>{lessonWords.lesson.title} - So'zlar</h2>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
              {lessonWords.words.map((word) => (
                <Card key={word.id}>
                  <CardContent className='px-3 py-0'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <div className='text-sm font-medium'>{word.word} - {word.meaning}</div>
                        <div className='flex space-x-1'>
                          {Array.from({ length: 7 }, (_, index) => {
                            const attempt = word.stats.last_seven_attempts[index]
                            return (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                  attempt === '1' ? 'bg-green-500' : 
                                  attempt === '0' ? 'bg-red-500' : 'bg-gray-300'
                                }`}
                              />
                            )
                          })}
                        </div>
                      </div>
                      <div className={`text-sm font-medium px-2 py-1 rounded ${
                        word.stats.is_weak ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {word.stats.recent_accuracy}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Main>
    </>
  )
}