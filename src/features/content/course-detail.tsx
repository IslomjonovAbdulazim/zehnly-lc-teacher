import { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, GraduationCap, FileText, Hash } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { contentApi, type CourseDetail } from '@/lib/api'
import { toast } from 'sonner'

export function CourseDetail() {
  const { courseId } = useParams({ strict: false })
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [openModules, setOpenModules] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadCourseDetail = async () => {
      if (!courseId) return
      
      try {
        setLoading(true)
        const data = await contentApi.getCourseDetail(parseInt(courseId))
        setCourseData(data)
        // Open first module by default
        if (data.modules.length > 0) {
          setOpenModules(new Set([data.modules[0].id]))
        }
      } catch (error) {
        console.error('Failed to load course detail:', error)
        toast.error('Kurs tafsilotlarini yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadCourseDetail()
  }, [courseId])

  const toggleModule = (moduleId: number) => {
    const newOpenModules = new Set(openModules)
    if (newOpenModules.has(moduleId)) {
      newOpenModules.delete(moduleId)
    } else {
      newOpenModules.add(moduleId)
    }
    setOpenModules(newOpenModules)
  }

  const handleViewLesson = (lessonId: number) => {
    navigate({ to: `/content/lessons/${lessonId}` })
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
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-32 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </Main>
      </>
    )
  }

  if (!courseData) return null

  return (
    <>
      <Header>
        <Button 
          variant='ghost' 
          size='sm'
          onClick={() => navigate({ to: '/content' })}
          className='mr-4'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Kurslarga Qaytish
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
            <div className='p-3 bg-blue-100 rounded-lg'>
              <GraduationCap className='h-8 w-8 text-blue-600' />
            </div>
            <div>
              <h1 className='text-3xl font-bold tracking-tight'>{courseData.title}</h1>
              <p className='text-muted-foreground'>{courseData.description}</p>
            </div>
          </div>

          <div className='flex items-center space-x-6'>
            <Badge variant='outline' className='flex items-center space-x-1'>
              <BookOpen className='h-3 w-3' />
              <span>{courseData.modules.length} modul</span>
            </Badge>
            <Badge variant='outline' className='flex items-center space-x-1'>
              <FileText className='h-3 w-3' />
              <span>{courseData.modules.reduce((total, module) => total + module.lessons.length, 0)} dars</span>
            </Badge>
          </div>
        </div>

        <div className='space-y-4'>
          {courseData.modules.map((module) => (
            <Card key={module.id}>
              <Collapsible
                open={openModules.has(module.id)}
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className='cursor-pointer hover:bg-muted/50 transition-colors'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <Badge variant='secondary'>#{module.order_index}</Badge>
                        <div>
                          <CardTitle className='text-lg'>{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant='outline'>
                        {module.lessons.length} dars
                      </Badge>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className='pt-0'>
                    <div className='space-y-3'>
                      {module.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className='flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors'
                        >
                          <div className='flex items-center space-x-3'>
                            <Badge variant='outline' size='sm'>
                              {lesson.order_index}
                            </Badge>
                            <div>
                              <h4 className='font-medium'>{lesson.title}</h4>
                              <p className='text-sm text-muted-foreground'>{lesson.description}</p>
                            </div>
                          </div>
                          
                          <div className='flex items-center space-x-3'>
                            <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
                              <Hash className='h-3 w-3' />
                              <span>{lesson.word_count} so'z</span>
                            </div>
                            <Button 
                              size='sm'
                              variant='outline'
                              onClick={() => handleViewLesson(lesson.id)}
                            >
                              <Eye className='h-3 w-3 mr-1' />
                              So'zlar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {courseData.modules.length === 0 && (
          <Card className='text-center py-12'>
            <CardContent>
              <BookOpen className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-medium mb-2'>Modul Topilmadi</h3>
              <p className='text-muted-foreground'>Ushbu kurs uchun hali modullar yaratilmagan.</p>
            </CardContent>
          </Card>
        )}
      </Main>
    </>
  )
}